import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:get_storage/get_storage.dart';
import '../../../data/services/api_service.dart';
import '../../../core/values/app_config.dart';
import '../../../routes/app_pages.dart';

class LoginController extends GetxController {
  final apiService = ApiService.to;
  final storage = GetStorage();

  final emailController = TextEditingController();
  final passwordController = TextEditingController();

  final isObscure = true.obs;
  final selectedRoleIndex = 2.obs; // Default to Student (Étudiant)
  final rememberMe = false.obs;
  final isLoading = false.obs;

  final roles = ['Ministère', 'Université', 'Étudiant', 'Recruteur'];

  void toggleObscure() => isObscure.value = !isObscure.value;
  void selectRole(int index) => selectedRoleIndex.value = index;
  void toggleRememberMe(bool? value) => rememberMe.value = value ?? false;

  Future<void> login() async {
    final email = emailController.text.trim();
    final password = passwordController.text.trim();

    if (email.isEmpty || password.isEmpty) {
      Get.snackbar(
        'Erreur',
        'Veuillez remplir tous les champs',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
      return;
    }

    try {
      isLoading.value = true;
      final response = await apiService.login(email, password);

      if (response.status.isOk) {
        final data = response.body['data'];
        final token = data['token'];
        
        // Sauvegarder le token
        apiService.saveToken(token);
        apiService.saveUser(data['user']);

        Get.snackbar(
          'Succès',
          'Connexion réussie',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.green,
          colorText: Colors.white,
        );

        // Navigate to dashboard on success
        Get.offAllNamed(Routes.DASHBOARD);
      } else {
        Get.snackbar(
          'Erreur',
          response.body['message'] ?? 'Identifiants invalides',
          snackPosition: SnackPosition.BOTTOM,
          backgroundColor: Colors.red,
          colorText: Colors.white,
        );
      }
    } catch (e) {
      Get.snackbar(
        'Erreur',
        'Une erreur est survenue lors de la connexion',
        snackPosition: SnackPosition.BOTTOM,
        backgroundColor: Colors.red,
        colorText: Colors.white,
      );
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
