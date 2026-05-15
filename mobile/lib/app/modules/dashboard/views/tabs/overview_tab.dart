import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../routes/app_pages.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';
import '../student_list_view.dart';

class OverviewTab extends GetView<DashboardController> {
  const OverviewTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Obx(() {
      final role = controller.userRole.value;
      
      return SingleChildScrollView(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            _buildWelcomeHeader(),
            SizedBox(height: 24.h),
            _buildStatsGrid(),
            SizedBox(height: 24.h),
            if (role == 'institution') ...[
              _buildInstitutionActions(),
              SizedBox(height: 24.h),
            ] else if (role == 'student') ...[
              _buildStudentActions(),
              SizedBox(height: 24.h),
            ] else if (role == 'employer') ...[
              _buildQuickVerify(),
              SizedBox(height: 24.h),
            ],
            _buildHistorySection(),
          ],
        ),
      );
    });
  }

  Widget _buildWelcomeHeader() {
    final user = controller.apiService.getUser();
    final firstName = user != null ? user['firstName'] : 'Utilisateur';

    return Container(
      width: double.infinity,
      padding: EdgeInsets.all(20.w),
      decoration: BoxDecoration(
        color: AppColors.darkBlue,
        borderRadius: BorderRadius.circular(16.r),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Text(
                'Bonjour, $firstName',
                style: TextStyle(
                  color: Colors.white,
                  fontSize: 20.sp,
                  fontWeight: FontWeight.bold,
                ),
              ),
              SizedBox(width: 8.w),
              const Icon(Icons.front_hand_outlined, color: Colors.white, size: 20),
            ],
          ),
          SizedBox(height: 4.h),
          Text(
            user?['role'] == 'student' 
                ? 'Consultez et partagez vos diplômes certifiés.'
                : 'Vérifiez instantanément l\'authenticité des diplômes.',
            style: TextStyle(color: Colors.white.withOpacity(0.8), fontSize: 13.sp),
          ),
        ],
      ),
    );
  }

  Widget _buildStatsGrid() {
    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      gridDelegate: SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 2,
        crossAxisSpacing: 12.w,
        mainAxisSpacing: 12.h,
        childAspectRatio: 1.5,
      ),
      itemCount: controller.stats.length,
      itemBuilder: (context, index) {
        final stat = controller.stats[index];
        return Container(
          padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 8.h),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12.r),
            border: Border.all(color: AppColors.divider),
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            mainAxisAlignment: MainAxisAlignment.spaceEvenly,
            children: [
              Text(
                stat['value']!,
                style: TextStyle(
                  fontSize: 20.sp,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textDark,
                ),
              ),
              Text(
                stat['label']!,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey),
              ),
              Container(
                padding: EdgeInsets.symmetric(horizontal: 6.w, vertical: 2.h),
                decoration: BoxDecoration(
                  color: index == 2 ? AppColors.error.withOpacity(0.1) : AppColors.success.withOpacity(0.1),
                  borderRadius: BorderRadius.circular(4.r),
                ),
                child: Text(
                  stat['trend']!,
                  style: TextStyle(
                    fontSize: 10.sp,
                    color: index == 2 ? AppColors.error : AppColors.success,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildInstitutionActions() {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Gestion Université',
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16.h),
          Row(
            children: [
              Expanded(
                child: _buildActionButton(
                  Icons.person_add_outlined,
                  'Étudiants',
                  () => Get.to(() => const StudentListView()),
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: _buildActionButton(
                  Icons.post_add_outlined,
                  'Émettre',
                  () => controller.changeIndex(1),
                  color: AppColors.primaryOrange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildStudentActions() {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Mon Espace Étudiant',
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16.h),
          Row(
            children: [
              Expanded(
                child: _buildActionButton(
                  Icons.qr_code_2_outlined,
                  'Mon QR',
                  () {},
                ),
              ),
              SizedBox(width: 12.w),
              Expanded(
                child: _buildActionButton(
                  Icons.share_outlined,
                  'Partager',
                  () {},
                  color: AppColors.primaryOrange,
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildActionButton(IconData icon, String label, VoidCallback onTap, {Color? color}) {
    return InkWell(
      onTap: onTap,
      borderRadius: BorderRadius.circular(8.r),
      child: Container(
        padding: EdgeInsets.symmetric(vertical: 12.h),
        decoration: BoxDecoration(
          color: (color ?? AppColors.darkBlue).withOpacity(0.05),
          borderRadius: BorderRadius.circular(8.r),
          border: Border.all(color: (color ?? AppColors.darkBlue).withOpacity(0.1)),
        ),
        child: Column(
          children: [
            Icon(icon, color: color ?? AppColors.darkBlue),
            SizedBox(height: 4.h),
            Text(
              label,
              style: TextStyle(
                fontSize: 12.sp,
                fontWeight: FontWeight.bold,
                color: color ?? AppColors.darkBlue,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildQuickVerify() {
    return Container(
      padding: EdgeInsets.all(16.w),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(12.r),
        border: Border.all(color: AppColors.divider),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Vérification rapide',
            style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
          ),
          SizedBox(height: 16.h),
          TextField(
            decoration: InputDecoration(
              hintText: 'Numéro du diplôme...',
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
              contentPadding: EdgeInsets.symmetric(horizontal: 12.w),
            ),
          ),
          SizedBox(height: 12.h),
          SizedBox(
            width: double.infinity,
            child: ElevatedButton.icon(
              onPressed: () => Get.toNamed('/result'),
              icon: const Icon(Icons.search, size: 18),
              label: const Text('Vérifier'),
            ),
          ),
          SizedBox(height: 16.h),
          const Center(child: Text('OR', style: TextStyle(color: AppColors.textGrey))),
          SizedBox(height: 16.h),
          SizedBox(
            width: double.infinity,
            child: OutlinedButton.icon(
              onPressed: () {},
              icon: const Icon(Icons.qr_code_scanner, size: 18),
              label: const Text('Scanner un QR code'),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildHistorySection() {
    final role = controller.userRole.value;
    final title = role == 'student' ? 'Mes Diplômes' : (role == 'institution' ? 'Diplômes émis' : 'Historique récent');

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
            ),
            TextButton(
              onPressed: () => controller.changeIndex(role == 'student' ? 1 : 2),
              child: const Text('Tout voir'),
            ),
          ],
        ),
        Obx(() => ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: controller.history.length > 5 ? 5 : controller.history.length,
          itemBuilder: (context, index) {
            final item = controller.history[index];
            final isAuthentic = item['status'] == 'Authentique';
            return Card(
              margin: EdgeInsets.only(bottom: 12.h),
              child: ListTile(
                onTap: () {
                  Get.toNamed(Routes.RESULT, arguments: item['rawData']);
                },
                title: Text(item['name']!, style: const TextStyle(fontWeight: FontWeight.bold)),
                subtitle: Text('${item['degree']} • ${item['school']}'),
                trailing: Container(
                  padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                  decoration: BoxDecoration(
                    color: isAuthentic ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4.r),
                  ),
                  child: Text(
                    item['status']!,
                    style: TextStyle(
                      fontSize: 10.sp,
                      color: isAuthentic ? AppColors.success : AppColors.error,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ),
              ),
            );
          },
        )),
      ],
    );
  }
}
