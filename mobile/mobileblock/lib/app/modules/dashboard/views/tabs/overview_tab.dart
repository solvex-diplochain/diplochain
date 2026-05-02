import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';

class OverviewTab extends GetView<DashboardController> {
  const OverviewTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildWelcomeHeader(),
          SizedBox(height: 24.h),
          _buildStatsGrid(),
          SizedBox(height: 24.h),
          _buildQuickVerify(),
          SizedBox(height: 24.h),
          _buildHistorySection(),
        ],
      ),
    );
  }

  Widget _buildWelcomeHeader() {
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
          Text(
            'Bonjour, Équipe RH 👋',
            style: TextStyle(
              color: Colors.white,
              fontSize: 20.sp,
              fontWeight: FontWeight.bold,
            ),
          ),
          SizedBox(height: 4.h),
          Text(
            'Vérifiez instantanément l\'authenticité des diplômes.',
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
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Historique récent',
              style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold),
            ),
            TextButton(
              onPressed: () => controller.changeIndex(2),
              child: const Text('Tout voir'),
            ),
          ],
        ),
        ListView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: controller.history.length,
          itemBuilder: (context, index) {
            final item = controller.history[index];
            final isAuthentic = item['status'] == 'Authentique';
            return Card(
              margin: EdgeInsets.only(bottom: 12.h),
              child: ListTile(
                onTap: () => Get.toNamed('/result'),
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
        ),
      ],
    );
  }
}
