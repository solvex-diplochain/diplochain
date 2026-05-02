import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/public_verify_controller.dart';

class PublicVerifyView extends GetView<PublicVerifyController> {
  const PublicVerifyView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Vérification publique', style: TextStyle(fontSize: 18.sp)),
        actions: [
          TextButton(
            onPressed: () => Get.toNamed('/login'),
            child: const Text('Connexion', style: TextStyle(color: Colors.white)),
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: EdgeInsets.all(24.w),
        child: Column(
          children: [
            Container(
              padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.1),
                borderRadius: BorderRadius.circular(20.r),
              ),
              child: Text(
                '✅ Service gratuit — Aucun compte requis',
                style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 12.sp),
              ),
            ),
            SizedBox(height: 24.h),
            Text(
              'Vérifiez l\'authenticité d\'un diplôme',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 24.sp, fontWeight: FontWeight.bold, color: AppColors.textDark),
            ),
            SizedBox(height: 12.h),
            Text(
              'Entrez le numéro du diplôme ou scannez le QR code pour une vérification instantanée et fiable',
              textAlign: TextAlign.center,
              style: TextStyle(fontSize: 14.sp, color: AppColors.textGrey),
            ),
            SizedBox(height: 32.h),
            _buildVerifyCard(),
            SizedBox(height: 32.h),
            _buildTrustRow(),
            SizedBox(height: 40.h),
            _buildHowToSection(),
            SizedBox(height: 40.h),
            _buildRecruiterCTA(),
          ],
        ),
      ),
    );
  }

  Widget _buildVerifyCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            _buildManualInput(),
            SizedBox(height: 24.h),
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
            SizedBox(height: 24.h),
            TextButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.qr_code_scanner, color: AppColors.darkBlue),
              label: Text('Scanner un QR code avec ma caméra', style: TextStyle(color: AppColors.darkBlue, fontWeight: FontWeight.bold)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildManualInput() {
    return Column(
      children: [
        TextField(
          decoration: InputDecoration(
            hintText: 'Ex: UO-2024-00851',
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
          ),
        ),
        SizedBox(height: 16.h),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton.icon(
            onPressed: () => Get.toNamed('/result'),
            icon: const Icon(Icons.search),
            label: const Text('Vérifier maintenant'),
          ),
        ),
      ],
    );
  }

  Widget _buildTrustRow() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: [
        _buildTrustItem(Icons.lock_outline, 'Vérification sécurisée'),
        _buildTrustItem(Icons.bolt, 'Résultat instantané'),
        _buildTrustItem(Icons.card_membership, '100% Gratuit'),
      ],
    );
  }

  Widget _buildTrustItem(IconData icon, String label) {
    return Expanded(
      child: Column(
        children: [
          Icon(icon, color: AppColors.darkBlue, size: 24.sp),
          SizedBox(height: 8.h),
          Text(label, textAlign: TextAlign.center, style: TextStyle(fontSize: 10.sp, color: AppColors.textGrey)),
        ],
      ),
    );
  }

  Widget _buildHowToSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Comment vérifier un diplôme ?', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold)),
        SizedBox(height: 24.h),
        _buildStep(1, 'Demandez le code ou QR code à l\'étudiant'),
        _buildStep(2, 'Entrez le code dans le champ ci-dessus'),
        _buildStep(3, 'Obtenez le résultat en 3 secondes'),
      ],
    );
  }

  Widget _buildStep(int num, String text) {
    return Padding(
      padding: EdgeInsets.only(bottom: 16.h),
      child: Row(
        children: [
          CircleAvatar(
            radius: 14.r,
            backgroundColor: AppColors.darkBlue,
            child: Text(num.toString(), style: const TextStyle(color: Colors.white, fontWeight: FontWeight.bold)),
          ),
          SizedBox(width: 16.w),
          Expanded(child: Text(text, style: TextStyle(fontSize: 14.sp, color: AppColors.textDark))),
        ],
      ),
    );
  }

  Widget _buildRecruiterCTA() {
    return Container(
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: AppColors.darkBlue.withOpacity(0.05),
        borderRadius: BorderRadius.circular(16.r),
        border: Border.all(color: AppColors.darkBlue.withOpacity(0.1)),
      ),
      child: Column(
        children: [
          Text(
            'Vous recrutez régulièrement ?',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 8.h),
          Text(
            'Créez un compte recruteur gratuit pour accéder à l\'historique de toutes vos vérifications',
            textAlign: TextAlign.center,
            style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey),
          ),
          SizedBox(height: 20.h),
          ElevatedButton(
            onPressed: () {},
            child: const Text('Créer mon compte gratuitement'),
          ),
        ],
      ),
    );
  }
}
