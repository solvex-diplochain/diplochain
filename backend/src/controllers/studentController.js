const User = require('../models/User');
const Institution = require('../models/Institution');
const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const headerMap = {
  'email': 'email',
  'e-mail': 'email',
  'courriel': 'email',
  'firstname': 'firstName',
  'prénom': 'firstName',
  'prenom': 'firstName',
  'lastname': 'lastName',
  'nom': 'lastName',
  'studentid': 'studentId',
  'matricule': 'studentId',
  'id': 'studentId',
  'major': 'major',
  'filière': 'major',
  'filiere': 'major',
  'spécialité': 'major',
  'specialite': 'major'
};

const normalizeHeaders = (data) => {
  return data.map(row => {
    const normalized = {};
    Object.keys(row).forEach(key => {
      const lowerKey = key.toLowerCase().trim();
      const targetKey = headerMap[lowerKey] || lowerKey;
      normalized[targetKey] = row[key];
    });
    return normalized;
  });
};

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
    let rawData = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
    
    // Normaliser les en-têtes (Français/Anglais)
    const data = normalizeHeaders(rawData);

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

// @desc    Créer un étudiant manuellement
// @route   POST /api/etudiants
// @access  Private (institution only)
const createStudent = async (req, res, next) => {
  try {
    const { email, firstName, lastName, studentId, major, password } = req.body;

    // Trouver l'institution
    const institution = await Institution.findOne({ adminUser: req.user._id });
    if (!institution) {
      return res.status(404).json({ success: false, message: 'Institution non trouvée' });
    }

    // Vérifier si l'utilisateur existe déjà
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Un utilisateur avec cet email existe déjà' });
    }

    // Créer l'étudiant
    const student = await User.create({
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

    res.status(201).json({
      success: true,
      message: 'Étudiant créé avec succès',
      data: student
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Télécharger le modèle d'importation
// @route   GET /api/etudiants/template
// @access  Private (institution only)
const downloadTemplate = async (req, res, next) => {
  try {
    const templateData = [
      {
        email: 'etudiant@exemple.com',
        firstName: 'Jean',
        lastName: 'Dupont',
        studentId: 'STUD2024001',
        major: 'Informatique',
        password: 'Password123!'
      }
    ];

    const worksheet = xlsx.utils.json_to_sheet(templateData);
    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Modèle Import');

    const tempPath = path.join(__dirname, '../../uploads/template_students.xlsx');
    
    // S'assurer que le dossier existe
    const dir = path.dirname(tempPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    xlsx.writeFile(workbook, tempPath);

    res.download(tempPath, 'modele_import_etudiants.xlsx', (err) => {
      if (err) {
        next(err);
      }
      // On garde le fichier ou on le supprime ? 
      // Mieux vaut le supprimer après envoi pour ne pas encombrer
      try { fs.unlinkSync(tempPath); } catch (e) {}
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getStudents,
  importStudents,
  createStudent,
  downloadTemplate
};
