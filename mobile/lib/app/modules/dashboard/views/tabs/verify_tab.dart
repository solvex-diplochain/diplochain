import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';

class VerifyTab extends GetView<DashboardController> {
  const VerifyTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Vérifier un diplôme',
            style: TextStyle(fontSize: 24.sp, fontWeight: FontWeight.bold, color: AppColors.textDark),
          ),
          SizedBox(height: 8.h),
          Text(
            'Vérifiez instantanément l\'authenticité d\'un candidat',
            style: TextStyle(fontSize: 14.sp, color: AppColors.textGrey),
          ),
          SizedBox(height: 24.h),
          _buildVerificationCard(),
          SizedBox(height: 24.h),
          _buildOptionalInfoCard(),
          SizedBox(height: 24.h),
          _buildRecentVerificationsSummary(),
          SizedBox(height: 32.h),
          _buildTrustIndicators(),
        ],
      ),
    );
  }

  Widget _buildVerificationCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.all(4.w),
              decoration: BoxDecoration(
                color: AppColors.background,
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: _buildTabItem('Code manuel', true),
                  ),
                  Expanded(
                    child: _buildTabItem('Scanner QR', false),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20.h),
            Container(
              padding: EdgeInsets.all(12.w),
              decoration: BoxDecoration(
                color: Colors.blue.withOpacity(0.05),
                borderRadius: BorderRadius.circular(8.r),
                border: Border.all(color: Colors.blue.withOpacity(0.1)),
              ),
              child: Row(
                children: [
                  const Icon(Icons.info_outline, color: Colors.blue, size: 20),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Text(
                      'Demandez au candidat son code de diplôme DiploChain.',
                      style: TextStyle(fontSize: 12.sp, color: Colors.blue.shade900),
                    ),
                  ),
                ],
              ),
            ),
            SizedBox(height: 20.h),
            Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'CODE DU DIPLÔME',
                  style: TextStyle(fontSize: 12.sp, fontWeight: FontWeight.bold, color: AppColors.textDark),
                ),
                SizedBox(height: 8.h),
                TextField(
                  decoration: InputDecoration(
                    hintText: 'Ex: UO-2024-00851',
                    border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
                    contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
                  ),
                ),
                SizedBox(height: 4.h),
                Text(
                  'Le code se trouve sur le diplôme numérique',
                  style: TextStyle(fontSize: 10.sp, color: AppColors.textGrey),
                ),
              ],
            ),
            SizedBox(height: 24.h),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton.icon(
                onPressed: () => Get.toNamed('/result'),
                icon: const Icon(Icons.search),
                label: const Text('Vérifier maintenant'),
              ),
            ),
            SizedBox(height: 16.h),
            const Row(
              children: [
                Expanded(child: Divider()),
                Padding(
                  padding: EdgeInsets.symmetric(horizontal: 8.0),
                  child: Text('ou', style: TextStyle(color: AppColors.textGrey)),
                ),
                Expanded(child: Divider()),
              ],
            ),
            SizedBox(height: 16.h),
            SizedBox(
              width: double.infinity,
              child: OutlinedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.qr_code_scanner),
                label: const Text('Passer en mode scanner QR code'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTabItem(String label, bool isSelected) {
    return Container(
      padding: EdgeInsets.symmetric(vertical: 10.h),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.darkBlue : Colors.transparent,
        borderRadius: BorderRadius.circular(6.r),
      ),
      child: Text(
        label,
        textAlign: TextAlign.center,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.textGrey,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
          fontSize: 13.sp,
        ),
      ),
    );
  }

  Widget _buildOptionalInfoCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              'Informations du candidat (optionnel)',
              style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.bold),
            ),
            SizedBox(height: 16.h),
            _buildSmallField('NOM DU CANDIDAT', 'Ex: OUÉDRAOGO Fatimata'),
            SizedBox(height: 12.h),
            _buildSmallField('POSTE VISÉ', 'Ex: Développeur Web Senior'),
          ],
        ),
      ),
    );
  }

  Widget _buildSmallField(String label, String hint) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: TextStyle(fontSize: 10.sp, fontWeight: FontWeight.bold, color: AppColors.textGrey)),
        SizedBox(height: 4.h),
        TextField(
          decoration: InputDecoration(
            hintText: hint,
            isDense: true,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
            contentPadding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 10.h),
          ),
        ),
      ],
    );
  }

  Widget _buildRecentVerificationsSummary() {
    return Container(
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Vérifications récentes', style: TextStyle(fontSize: 14.sp, fontWeight: FontWeight.bold)),
          SizedBox(height: 12.h),
          _buildRecentItem('SAWADOGO Aïcha', 'Licence Droit', true),
          _buildRecentItem('TRAORÉ Ibrahim', 'BTS Comptabilité', false),
        ],
      ),
    );
  }

  Widget _buildRecentItem(String name, String degree, bool isSuccess) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8.h),
      child: Row(
        children: [
          Icon(
            isSuccess ? Icons.check_circle : Icons.cancel,
            color: isSuccess ? AppColors.success : AppColors.error,
            size: 16.sp,
          ),
          SizedBox(width: 8.w),
          Expanded(
            child: Text(
              '$name — $degree',
              style: TextStyle(fontSize: 12.sp, color: AppColors.textDark),
              overflow: TextOverflow.ellipsis,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTrustIndicators() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildTrustItem(Icons.lock_outline, 'Sécurisée'),
        _buildTrustItem(Icons.bolt, 'Instantané'),
        _buildTrustItem(Icons.save_outlined, 'Sauvegardé'),
      ],
    );
  }

  Widget _buildTrustItem(IconData icon, String label) {
    return Column(
      children: [
        Icon(icon, size: 20.sp, color: AppColors.textGrey),
        SizedBox(height: 4.h),
        Text(label, style: TextStyle(fontSize: 10.sp, color: AppColors.textGrey)),
      ],
    );
  }
}
