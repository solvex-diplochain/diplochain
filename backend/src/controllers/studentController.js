const User = require('../models/User');
const Institution = require('../models/Institution');
const xlsx = require('xlsx');
const fs = require('fs');

// @desc    Obtenir tous les étudiants (d'une institution si filtré)
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res, next) => {
  try {
    const query = { role: 'student' };

    // Si l'utilisateur est une institution, voir uniquement ses étudiants
    if (req.user.role === 'institution') {
      const institution = await Institution.findOne({ adminUser: req.user._id });
      if (institution) {
        query['studentProfile.institution'] = institution._id;
      }
    }

    const students = await User.find(query).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Importer des étudiants depuis Excel/CSV
// @route   POST /api/students/import
// @access  Private (institution only)
const importStudents = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Veuillez uploader un fichier Excel ou CSV' });
    }

    // Lire le fichier
    const workbook = xlsx.readFile(req.file.path);
    const sheetName = workbook.SheetNames[0];
    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

    // Trouver l'institution
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    const results = {
      total: data.length,
      imported: 0,
      errors: []
    };

    // Traiter chaque ligne
    for (const row of data) {
      try {
        const { email, firstName, lastName, password, studentId, major } = row;

        // Vérifier si l'utilisateur existe déjà
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
          results.errors.push({ email, error: 'Cet email est déjà utilisé' });
          continue;
        }

        // Créer l'étudiant
        await User.create({
          email,
          firstName,
          lastName,
          password: password || 'DefaultPass123!',
          role: 'student',
          studentProfile: {
            studentId,
            major,
            institution: institution._id
          }
        });

        results.imported++;
      } catch (err) {
        results.errors.push({ email: row.email, error: err.message });
      }
    }

    // Supprimer le fichier temporaire
    fs.unlinkSync(req.file.path);

    res.status(201).json({
      success: true,
      message: `${results.imported} étudiants importés avec succès`,
      data: results
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  importStudents
};
