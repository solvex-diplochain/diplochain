import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../../../routes/app_pages.dart';
import '../controllers/landing_controller.dart';

class LandingView extends GetView<LandingController> {
  const LandingView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.link, color: Colors.white),
            SizedBox(width: 8.w),
            Text(
              'DiploChain',
              style: TextStyle(
                fontWeight: FontWeight.bold,
                fontSize: 20.sp,
              ),
            ),
          ],
        ),
        actions: [
          TextButton(
            onPressed: () => Get.toNamed(Routes.LOGIN),
            child: const Text(
              'Se connecter',
              style: TextStyle(color: Colors.white),
            ),
          ),
          SizedBox(width: 16.w),
        ],
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            _buildHeroSection(),
            _buildStatsSection(),
            _buildHowItWorksSection(),
            _buildUsersSection(),
            _buildFooter(),
          ],
        ),
      ),
    );
  }

  Widget _buildHeroSection() {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 40.h),
      color: Colors.white,
      child: Column(
        children: [
          Text(
            'Vérifiez un diplôme en 3 secondes',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 28.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: 16.h),
          Text(
            'DiploChain garantit l\'authenticité des diplômes burkinabè grâce à la blockchain',
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 16.sp,
              color: AppColors.textGrey,
            ),
          ),
          SizedBox(height: 32.h),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => Get.toNamed(Routes.PUBLIC_VERIFY),
              icon: const Icon(Icons.search),
              label: const Text('Vérifier un diplôme'),
            ),
          ),
          SizedBox(height: 12.h),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton(
              onPressed: () => Get.toNamed(Routes.LOGIN),
              style: OutlinedButton.styleFrom(
                padding: EdgeInsets.symmetric(vertical: 12.h),
                side: const BorderSide(color: AppColors.darkBlue),
              ),
              child: const Text('Se connecter'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsSection() {
    return Container(
      padding: EdgeInsets.symmetric(horizontal: 24.w, vertical: 32.h),
      child: Column(
        children: [
          _buildStatCard('1 248', 'Diplômes enregistrés'),
          SizedBox(height: 16.h),
          _buildStatCard('3 891', 'Vérifications effectuées'),
          SizedBox(height: 16.h),
          _buildStatCard('99.9%', 'Disponibilité blockchain'),
        ],
      ),
    );
  }

  Widget _buildStatCard(String value, String label) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        children: [
          Text(
            value,
            style: TextStyle(
              fontSize: 24.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: 4.h),
          Text(
            label,
            style: TextStyle(
              fontSize: 14.sp,
              color: AppColors.textGrey,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHowItWorksSection() {
    return Container(
      padding: EdgeInsets.all(24.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Comment ça fonctionne',
            style: TextStyle(
              fontSize: 20.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: 24.h),
          _buildStepItem(
            Icons.school,
            'L\'université enregistre le diplôme sur la blockchain',
          ),
          _buildStepItem(
            Icons.qr_code,
            'L\'étudiant reçoit son QR code unique',
          ),
          _buildStepItem(
            Icons.check_circle,
            'Le recruteur scanne et vérifie en 3 secondes',
          ),
        ],
      ),
    );
  }

  Widget _buildStepItem(IconData icon, String text) {
    return Padding(
      padding: EdgeInsets.only(bottom: 20.h),
      child: Row(
        children: [
          Container(
            padding: EdgeInsets.all(12.w),
            decoration: BoxDecoration(
              color: AppColors.background,
              borderRadius: BorderRadius.circular(12.r),
            ),
            child: Icon(icon, color: AppColors.darkBlue),
          ),
          SizedBox(width: 16.w),
          Expanded(
            child: Text(
              text,
              style: TextStyle(fontSize: 14.sp, color: AppColors.textDark),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildUsersSection() {
    return Container(
      padding: EdgeInsets.all(24.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Qui utilise DiploChain ?',
            style: TextStyle(
              fontSize: 20.sp,
              fontWeight: FontWeight.bold,
              color: AppColors.textDark,
            ),
          ),
          SizedBox(height: 24.h),
          GridView.count(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            crossAxisCount: 2,
            mainAxisSpacing: 16.h,
            crossAxisSpacing: 16.w,
            childAspectRatio: 1.2,
            children: [
              _buildUserCard('Ministère', 'Accrédite les établissements', Icons.account_balance),
              _buildUserCard('Université', 'Émet les diplômes numériques', Icons.school),
              _buildUserCard('Étudiant', 'Accède et partage son diplôme', Icons.person),
              _buildUserCard('Recruteur', 'Vérifie instantanément', Icons.business_center),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildUserCard(String title, String subtitle, IconData icon) {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: AppColors.textGrey, size: 24.sp),
          SizedBox(height: 8.h),
          Text(
            title,
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.sp),
          ),
          SizedBox(height: 4.h),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 10.sp, color: AppColors.textGrey),
          ),
        ],
      ),
    );
  }

  Widget _buildFooter() {
    return Container(
      padding: EdgeInsets.all(24.w),
      color: AppColors.darkBlue,
      child: Column(
        children: [
          Text(
            'DiploChain © 2026 — MIABE Hackathon — Burkina Faso',
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white.withOpacity(0.7), fontSize: 12.sp),
          ),
        ],
      ),
    );
  }
}
