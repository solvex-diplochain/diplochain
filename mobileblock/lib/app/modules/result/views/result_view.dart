import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/result_controller.dart';

class ResultView extends GetView<ResultController> {
  const ResultView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Text('Résultat de vérification', style: TextStyle(fontSize: 18.sp)),
        actions: [
          IconButton(
            onPressed: controller.toggleResult,
            icon: const Icon(Icons.swap_horiz),
            tooltip: 'Toggle Success/Failure (Demo)',
          ),
        ],
      ),
      body: Obx(() => SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: controller.isSuccess.value ? _buildSuccessUI() : _buildFailureUI(),
      )),
    );
  }

  Widget _buildSuccessUI() {
    return Column(
      children: [
        _buildHeader(
          'DIPLÔME AUTHENTIQUE',
          'Vérifié sur la blockchain DiploChain',
          AppColors.success,
          Icons.check_circle,
        ),
        SizedBox(height: 16.h),
        _buildDetailsCard(),
        SizedBox(height: 16.h),
        _buildBlockchainCard(),
        SizedBox(height: 24.h),
        Row(
          children: [
            Expanded(
              child: ElevatedButton.icon(
                onPressed: () {},
                icon: const Icon(Icons.download),
                label: const Text('Rapport'),
              ),
            ),
            SizedBox(width: 12.w),
            Expanded(
              child: OutlinedButton.icon(
                onPressed: () => Get.back(),
                icon: const Icon(Icons.search),
                label: const Text('Nouveau'),
              ),
            ),
          ],
        ),
        SizedBox(height: 24.h),
        _buildVerificationFooter(),
      ],
    );
  }

  Widget _buildFailureUI() {
    return Column(
      children: [
        _buildHeader(
          'DIPLÔME NON RECONNU',
          'Ce document n\'existe pas dans le registre',
          AppColors.error,
          Icons.cancel,
        ),
        SizedBox(height: 16.h),
        Card(
          child: Padding(
            padding: EdgeInsets.all(16.w),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  padding: EdgeInsets.all(12.w),
                  decoration: BoxDecoration(
                    color: AppColors.error.withOpacity(0.05),
                    borderRadius: BorderRadius.circular(8.r),
                    border: Border.all(color: AppColors.error.withOpacity(0.1)),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.warning_amber, color: AppColors.error),
                      SizedBox(width: 12.w),
                      Expanded(
                        child: Text(
                          'Ce diplôme n\'a jamais été enregistré sur la blockchain DiploChain.',
                          style: TextStyle(fontSize: 12.sp, color: AppColors.error),
                        ),
                      ),
                    ],
                  ),
                ),
                SizedBox(height: 20.h),
                Text('Ce que cela signifie :', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.sp)),
                SizedBox(height: 12.h),
                _buildMeaningItem('Ce document ne peut pas être considéré comme authentique'),
                _buildMeaningItem('Aucune université burkinabè n\'a émis ce diplôme'),
                _buildMeaningItem('La signature cryptographique est absente'),
                SizedBox(height: 20.h),
                Text('Code recherché : BF-FAKE-2024-99999', style: TextStyle(color: AppColors.textGrey, fontSize: 12.sp)),
              ],
            ),
          ),
        ),
        SizedBox(height: 16.h),
        Card(
          child: ListTile(
            leading: const Icon(Icons.report_problem_outlined, color: AppColors.error),
            title: const Text('Signaler une fraude'),
            subtitle: const Text('Si vous pensez être victime d\'une fraude'),
            onTap: () {},
          ),
        ),
        SizedBox(height: 24.h),
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: () => Get.back(),
            child: const Text('Nouvelle vérification'),
          ),
        ),
      ],
    );
  }

  Widget _buildHeader(String title, String subtitle, Color color, IconData icon) {
    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: color,
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Column(
        children: [
          Icon(icon, color: Colors.white, size: 48.sp),
          SizedBox(height: 12.h),
          Text(
            title,
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white, fontWeight: FontWeight.bold, fontSize: 20.sp),
          ),
          SizedBox(height: 4.h),
          Text(
            subtitle,
            textAlign: TextAlign.center,
            style: TextStyle(color: Colors.white.withOpacity(0.9), fontSize: 12.sp),
          ),
        ],
      ),
    );
  }

  Widget _buildDetailsCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            _buildDetailItem(Icons.person_outline, 'Titulaire', 'OUÉDRAOGO Fatimata'),
            _buildDetailItem(Icons.school_outlined, 'Formation', 'Licence en Informatique'),
            _buildDetailItem(Icons.account_balance_outlined, 'Établissement', 'Univ. de Ouagadougou'),
            _buildDetailItem(Icons.star_outline, 'Mention', 'Très bien'),
            _buildDetailItem(Icons.calendar_today_outlined, 'Date d\'obtention', '17/04/2024'),
            _buildDetailItem(Icons.numbers_outlined, 'Numéro', 'UO-2024-00851'),
          ],
        ),
      ),
    );
  }

  Widget _buildBlockchainCard() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('Blockchain Info', style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14.sp)),
            SizedBox(height: 16.h),
            _buildDetailItem(Icons.link, 'Enregistré sur la blockchain', 'Oui'),
            _buildDetailItem(Icons.event_available, 'Date d\'enregistrement', '18/04/2024'),
            _buildDetailItem(Icons.verified_user_outlined, 'Signé par', 'Univ. de Ouagadougou'),
            SizedBox(height: 16.h),
            Container(
              padding: EdgeInsets.all(8.w),
              decoration: BoxDecoration(
                color: AppColors.success.withOpacity(0.1),
                borderRadius: BorderRadius.circular(8.r),
              ),
              child: Row(
                children: [
                  const Icon(Icons.qr_code, color: AppColors.success, size: 40),
                  SizedBox(width: 12.w),
                  Expanded(
                    child: Text(
                      'Signature cryptographique valide et immuable',
                      style: TextStyle(color: AppColors.success, fontWeight: FontWeight.bold, fontSize: 12.sp),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildDetailItem(IconData icon, String label, String value) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Row(
        children: [
          Icon(icon, size: 18.sp, color: AppColors.textGrey),
          SizedBox(width: 12.w),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: TextStyle(fontSize: 10.sp, color: AppColors.textGrey)),
                Text(value, style: TextStyle(fontSize: 13.sp, fontWeight: FontWeight.bold, color: AppColors.textDark)),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildMeaningItem(String text) {
    return Padding(
      padding: EdgeInsets.only(bottom: 8.h),
      child: Row(
        children: [
          const Icon(Icons.close, color: AppColors.error, size: 14),
          SizedBox(width: 8.w),
          Expanded(child: Text(text, style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey))),
        ],
      ),
    );
  }

  Widget _buildVerificationFooter() {
    return Text(
      'Vérification effectuée le 24 avril 2026 à 14h32\nSécurisée et confidentielle',
      textAlign: TextAlign.center,
      style: TextStyle(color: AppColors.textGrey, fontSize: 10.sp),
    );
  }
}
