import 'package:get/get.dart';

class LoginController extends GetxController {
  final isObscure = true.obs;
  final selectedRoleIndex = 2.obs; // Default to Student (Étudiant)
  final rememberMe = false.obs;

  final roles = ['Ministère', 'Université', 'Étudiant', 'Recruteur'];

  void toggleObscure() => isObscure.value = !isObscure.value;
  void selectRole(int index) => selectedRoleIndex.value = index;
  void toggleRememberMe(bool? value) => rememberMe.value = value ?? false;

  void login() {
    // Navigate to dashboard on success
    Get.offAllNamed('/dashboard');
  }
}
