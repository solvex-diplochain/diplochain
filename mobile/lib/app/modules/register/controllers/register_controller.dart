import 'package:flutter/material.dart';
import 'package:get/get.dart';
import 'package:mobileblock/app/data/services/api_service.dart';
import 'package:mobileblock/app/routes/app_pages.dart';
import 'package:mobileblock/app/core/theme/app_colors.dart';

class RegisterController extends GetxController {
  final apiService = ApiService.to;
  
  final firstNameController = TextEditingController();
  final lastNameController = TextEditingController();
  final emailController = TextEditingController();
  final passwordController = TextEditingController();
  
  final isLoading = false.obs;
  final selectedRole = 'student'.obs;

  void register() async {
    if (emailController.text.isEmpty || passwordController.text.isEmpty) {
      Get.snackbar('Erreur', 'Veuillez remplir tous les champs', 
        backgroundColor: AppColors.error, colorText: Colors.white);
      return;
    }

    try {
      isLoading.value = true;
      final response = await apiService.register({
        'firstName': firstNameController.text.trim(),
        'lastName': lastNameController.text.trim(),
        'email': emailController.text.trim(),
        'password': passwordController.text,
        'role': selectedRole.value,
      });

      if (response.status.isOk) {
        Get.snackbar('Succès', 'Compte créé avec succès. Veuillez vous connecter.', 
          backgroundColor: AppColors.success, colorText: Colors.white);
        Get.offNamed(Routes.LOGIN);
      } else {
        Get.snackbar('Erreur', response.body['message'] ?? 'Échec de l\'inscription', 
          backgroundColor: AppColors.error, colorText: Colors.white);
      }
    } catch (e) {
      Get.snackbar('Erreur', 'Une erreur est survenue', 
        backgroundColor: AppColors.error, colorText: Colors.white);
    } finally {
      isLoading.value = false;
    }
  }

  @override
  void onClose() {
    firstNameController.dispose();
    lastNameController.dispose();
    emailController.dispose();
    passwordController.dispose();
    super.onClose();
  }
}
