import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobileblock/app/core/theme/app_colors.dart';
import 'package:mobileblock/app/modules/register/controllers/register_controller.dart';

class RegisterView extends GetView<RegisterController> {
  const RegisterView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Créer un compte')),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Rejoignez DiploChain',
              style: TextStyle(fontSize: 28.sp, fontWeight: FontWeight.bold, color: AppColors.darkBlue),
            ),
            SizedBox(height: 8.h),
            Text(
              'Sécurisez vos diplômes sur la blockchain',
              style: TextStyle(fontSize: 16.sp, color: AppColors.textGrey),
            ),
            SizedBox(height: 32.h),
            _buildField('Prénom', controller.firstNameController, Icons.person_outline),
            SizedBox(height: 16.h),
            _buildField('Nom', controller.lastNameController, Icons.person_outline),
            SizedBox(height: 16.h),
            _buildField('Email', controller.emailController, Icons.email_outlined),
            SizedBox(height: 16.h),
            _buildField('Mot de passe', controller.passwordController, Icons.lock_outline, isPassword: true),
            SizedBox(height: 24.h),
            Text(
              'JE SUIS UN...',
              style: TextStyle(fontSize: 12.sp, fontWeight: FontWeight.bold, color: AppColors.textGrey),
            ),
            SizedBox(height: 8.h),
            Obx(() => Row(
              children: [
                _buildRoleOption('student', 'Étudiant'),
                SizedBox(width: 12.w),
                _buildRoleOption('employer', 'Recruteur'),
              ],
            )),
            SizedBox(height: 32.h),
            SizedBox(
              width: double.infinity,
              child: Obx(() => ElevatedButton(
                onPressed: controller.isLoading.value ? null : controller.register,
                child: controller.isLoading.value 
                  ? const CircularProgressIndicator(color: Colors.white)
                  : const Text('S\'inscrire'),
              )),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, TextEditingController textController, IconData icon, {bool isPassword = false}) {
    return TextField(
      controller: textController,
      obscureText: isPassword,
      decoration: InputDecoration(
        labelText: label,
        prefixIcon: Icon(icon),
        border: OutlineInputBorder(borderRadius: BorderRadius.circular(12.r)),
      ),
    );
  }

  Widget _buildRoleOption(String role, String label) {
    final isSelected = controller.selectedRole.value == role;
    return Expanded(
      child: InkWell(
        onTap: () => controller.selectedRole.value = role,
        child: Container(
          padding: EdgeInsets.symmetric(vertical: 12.h),
          decoration: BoxDecoration(
            color: isSelected ? AppColors.darkBlue : Colors.white,
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(color: isSelected ? AppColors.darkBlue : AppColors.divider),
          ),
          child: Text(
            label,
            textAlign: TextAlign.center,
            style: TextStyle(
              color: isSelected ? Colors.white : AppColors.textDark,
              fontWeight: FontWeight.bold,
            ),
          ),
        ),
      ),
    );
  }
}
