import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/login_controller.dart';

class LoginView extends GetView<LoginController> {
  const LoginView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.link, color: Colors.white),
            SizedBox(width: 8.w),
            Text(
              'DiploChain',
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 20.sp),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.back(),
            child: const Text('Accueil', style: TextStyle(color: Colors.white)),
          ),
          SizedBox(width: 16.w),
        ],
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: EdgeInsets.all(24.w),
          child: Column(
            children: [
              SizedBox(height: 20.h),
              _buildLoginCard(),
              SizedBox(height: 32.h),
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  Icon(Icons.lock_outline, size: 14.sp, color: AppColors.textGrey),
                  SizedBox(width: 8.w),
                  Text(
                    'Connexion sécurisée — Données chiffrées',
                    style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey),
                  ),
                ],
              ),
              SizedBox(height: 40.h),
              Text(
                'DiploChain © 2026 — MIABE Hackathon — Burkina Faso',
                textAlign: TextAlign.center,
                style: TextStyle(color: AppColors.textGrey, fontSize: 12.sp),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildLoginCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(24.w),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: AppColors.darkBlue,
                borderRadius: BorderRadius.circular(12.r),
              ),
              child: const Icon(Icons.link, color: Colors.white, size: 32),
            ),
            SizedBox(height: 24.h),
            Text(
              'Connexion à DiploChain',
              style: TextStyle(
                fontSize: 22.sp,
                fontWeight: FontWeight.bold,
                color: AppColors.textDark,
              ),
            ),
            SizedBox(height: 8.h),
            Text(
              'Accédez à votre espace sécurisé',
              style: TextStyle(fontSize: 14.sp, color: AppColors.textGrey),
            ),
            SizedBox(height: 24.h),
            _buildRoleTabs(),
            SizedBox(height: 24.h),
            _buildTextField('Identifiant', 'Entrez votre identifiant'),
            SizedBox(height: 16.h),
            _buildPasswordField(),
            SizedBox(height: 16.h),
            Row(
              children: [
                Obx(() => Checkbox(
                  value: controller.rememberMe.value,
                  onChanged: controller.toggleRememberMe,
                  activeColor: AppColors.primaryOrange,
                )),
                Text('Se souvenir de moi', style: TextStyle(fontSize: 14.sp)),
              ],
            ),
            SizedBox(height: 24.h),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: controller.login,
                child: const Text('Se connecter'),
              ),
            ),
            SizedBox(height: 24.h),
            TextButton(
              onPressed: () {},
              child: const Text('Mot de passe oublié ?'),
            ),
            SizedBox(height: 8.h),
            Wrap(
              alignment: WrapAlignment.center,
              children: [
                Text(
                  'Recruteur? ',
                  style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey),
                ),
                GestureDetector(
                  onTap: () {},
                  child: Text(
                    'Créez votre compte gratuitement',
                    style: TextStyle(
                      fontSize: 12.sp,
                      color: AppColors.darkBlue,
                      fontWeight: FontWeight.bold,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildRoleTabs() {
    return Container(
      padding: EdgeInsets.all(4.w),
      decoration: BoxDecoration(
        color: AppColors.background,
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: SingleChildScrollView(
        scrollDirection: Axis.horizontal,
        child: Obx(() => Row(
          children: List.generate(controller.roles.length, (index) {
            final isSelected = controller.selectedRoleIndex.value == index;
            return GestureDetector(
              onTap: () => controller.selectRole(index),
              child: Container(
                padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
                decoration: BoxDecoration(
                  color: isSelected ? AppColors.darkBlue : Colors.transparent,
                  borderRadius: BorderRadius.circular(6.r),
                ),
                child: Text(
                  controller.roles[index],
                  style: TextStyle(
                    fontSize: 12.sp,
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected ? Colors.white : AppColors.textGrey,
                  ),
                ),
              ),
            );
          }),
        )),
      ),
    );
  }

  Widget _buildTextField(String label, String hint) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(
            fontSize: 14.sp,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        SizedBox(height: 8.h),
        TextField(
          decoration: InputDecoration(
            hintText: hint,
            hintStyle: TextStyle(color: AppColors.textGrey.withOpacity(0.5)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.r),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.r),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildPasswordField() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          'Mot de passe',
          style: TextStyle(
            fontSize: 14.sp,
            fontWeight: FontWeight.bold,
            color: AppColors.textDark,
          ),
        ),
        SizedBox(height: 8.h),
        Obx(() => TextField(
          obscureText: controller.isObscure.value,
          decoration: InputDecoration(
            hintText: 'Entrez votre mot de passe',
            hintStyle: TextStyle(color: AppColors.textGrey.withOpacity(0.5)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.r),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(8.r),
              borderSide: const BorderSide(color: AppColors.divider),
            ),
            suffixIcon: IconButton(
              icon: Icon(
                controller.isObscure.value ? Icons.visibility_off : Icons.visibility,
                color: AppColors.textGrey,
              ),
              onPressed: controller.toggleObscure,
            ),
          ),
        )),
      ],
    );
  }
}
