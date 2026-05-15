import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobileblock/app/core/theme/app_colors.dart';
import 'package:mobileblock/app/data/services/api_service.dart';
import 'package:mobileblock/app/routes/app_pages.dart';

class DashboardController extends GetxController {
  final apiService = ApiService.to;
  final selectedIndex = 0.obs;
  final isLoading = false.obs;

  void changeIndex(int index) => selectedIndex.value = index;

  final stats = <Map<String, String>>[].obs;
  final history = <Map<String, dynamic>>[].obs;
  final userRole = 'student'.obs;

  // Formulaire d'émission
  final studentEmailController = TextEditingController();
  final diplomaTitleController = TextEditingController();
  final fieldController = TextEditingController();
  final levelController = TextEditingController();
  final gradeController = TextEditingController();

  final currentUser = <String, dynamic>{}.obs;

  @override
  void onInit() {
    super.onInit();
    final user = apiService.getUser();
    if (user != null) {
      userRole.value = user['role'] ?? 'student';
      currentUser.value = user;
    }
    fetchDashboardData();
    refreshProfile();
  }

  Future<void> refreshProfile() async {
    try {
      final response = await apiService.getProfile();
      if (response.status.isOk) {
        final userData = response.body['data'];
        currentUser.value = userData;
        apiService.saveUser(userData);
      }
    } catch (e) {
      print('Error refreshing profile: $e');
    }
  }

  Future<void> fetchDashboardData() async {
    try {
      isLoading.value = true;
      
      // Récupérer les derniers diplômes pour l'historique
      final historyResponse = await apiService.getAllDiplomas();
      if (historyResponse.status.isOk) {
        final List<dynamic> diplomas = historyResponse.body['data'] ?? [];
        history.value = diplomas.map((d) => {
          'name': d['student'] != null ? '${d['student']['firstName']} ${d['student']['lastName']}' : 'Anonyme',
          'degree': d['title'] ?? 'Diplôme',
          'school': (d['institution'] != null) ? d['institution']['name'] : 'Etablissement',
          'date': d['issueDate'] != null ? d['issueDate'].toString().substring(0, 10) : 'N/A',
          'status': 'Authentique',
          'rawData': {
            ...d,
            'studentName': d['student'] != null ? '${d['student']['firstName']} ${d['student']['lastName']}' : 'Anonyme',
            'institutionName': (d['institution'] != null) ? d['institution']['name'] : 'Etablissement',
          },
        }).toList();
      }

      // Récupérer les stats (après l'historique pour avoir les longueurs si besoin)
      final statsResponse = await apiService.getDashboardStats();
      if (statsResponse.status.isOk) {
        final data = statsResponse.body['data'];
        if (userRole.value == 'student') {
          stats.value = [
            {'label': 'Mes Diplômes', 'value': '${history.length}', 'trend': 'Total'},
            {'label': 'Vérifiés', 'value': '${history.length}', 'trend': 'Blockchain'},
            {'label': 'Partages', 'value': '0', 'trend': 'Ce mois'},
            {'label': 'Alertes', 'value': '0', 'trend': 'Sécurité'},
          ];
        } else {
          stats.value = [
            {'label': 'Diplômes émis', 'value': '${data['totalDiplomas'] ?? 0}', 'trend': 'Total'},
            {'label': 'Vérifications', 'value': '${data['totalVerifications'] ?? 0}', 'trend': 'Ce mois'},
            {'label': 'Établissements', 'value': '${data['totalInstitutions'] ?? 0}', 'trend': 'Actifs'},
            {'label': 'Étudiants', 'value': '${data['totalStudents'] ?? 0}', 'trend': 'Inscrits'},
          ];
        }
      }
    } catch (e) {
      print('Error fetching dashboard data: $e');
    } finally {
      isLoading.value = false;
    }
  }

  Future<void> issueDiploma(Map<String, dynamic> diplomaData) async {
    try {
      isLoading.value = true;
      final response = await apiService.createDiploma(diplomaData);
      
      if (response.status.isOk) {
        Get.snackbar(
          'Succès',
          'Diplôme émis avec succès sur la blockchain',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: AppColors.success,
          colorText: Colors.white,
        );
        fetchDashboardData(); // Rafraîchir l'historique
        changeIndex(2); // Aller vers l'historique
      } else {
        Get.snackbar(
          'Erreur',
          response.body['message'] ?? 'Échec de l\'émission',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: AppColors.error,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Erreur',
        'Une erreur est survenue',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: AppColors.error,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  void logout() {
    apiService.logout();
    Get.offAllNamed(Routes.LANDING);
  }

  @override
  void onClose() {
    studentEmailController.dispose();
    diplomaTitleController.dispose();
    fieldController.dispose();
    levelController.dispose();
    gradeController.dispose();
    super.onClose();
  }
}
