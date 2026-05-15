import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../routes/app_pages.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';

class HistoryTab extends GetView<DashboardController> {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    final role = controller.userRole.value;

    return Obx(() => Column(
      children: [
        if (role != 'student') _buildHeaderStats(),
        _buildFilters(),
        if (role == 'employer') _buildAlertBanner(),
        Expanded(
          child: _buildHistoryList(),
        ),
      ],
    ));
  }

  Widget _buildHeaderStats() {
    return Container(
      height: 110.h,
      padding: EdgeInsets.symmetric(vertical: 12.h),
      child: ListView(
        scrollDirection: Axis.horizontal,
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        children: [
          _buildSmallStatCard('47', 'Total ce mois'),
          _buildSmallStatCard('45', 'Authentiques', color: AppColors.success),
          _buildSmallStatCard('2', 'Faux détectés', color: AppColors.error),
          _buildSmallStatCard('8', 'Aujourd\'hui'),
        ],
      ),
    );
  }

  Widget _buildSmallStatCard(String value, String label, {Color? color}) {
    return Container(
      width: 140.w,
      margin: EdgeInsets.only(right: 12.w),
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
            value,
            style: TextStyle(
              fontSize: 18.sp,
              fontWeight: FontWeight.bold,
              color: color ?? AppColors.textDark,
            ),
          ),
          Text(
            label,
            maxLines: 1,
            style: TextStyle(fontSize: 11.sp, color: AppColors.textGrey),
            overflow: TextOverflow.ellipsis,
          ),
        ],
      ),
    );
  }

  Widget _buildFilters() {
    final role = controller.userRole.value;
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: role == 'student' ? 'Rechercher dans mes diplômes...' : 'Rechercher un étudiant...',
              prefixIcon: const Icon(Icons.search),
              isDense: true,
              border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
            ),
          ),
          SizedBox(height: 12.h),
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: [
                _buildFilterChip('Tous', true),
                if (role != 'student') _buildFilterChip('Authentiques', false),
                if (role == 'employer') _buildFilterChip('Faux diplômes', false),
                _buildFilterChip('Récent', false),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildFilterChip(String label, bool isSelected) {
    return Container(
      margin: EdgeInsets.only(right: 8.w),
      padding: EdgeInsets.symmetric(horizontal: 12.w, vertical: 6.h),
      decoration: BoxDecoration(
        color: isSelected ? AppColors.darkBlue : Colors.white,
        borderRadius: BorderRadius.circular(20.r),
        border: Border.all(color: isSelected ? AppColors.darkBlue : AppColors.divider),
      ),
      child: Text(
        label,
        style: TextStyle(
          color: isSelected ? Colors.white : AppColors.textGrey,
          fontSize: 12.sp,
          fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
        ),
      ),
    );
  }

  Widget _buildAlertBanner() {
    return Container(
      margin: EdgeInsets.all(16.w),
      padding: EdgeInsets.all(12.w),
      decoration: BoxDecoration(
        color: AppColors.error.withOpacity(0.9),
        borderRadius: BorderRadius.circular(8.r),
      ),
      child: Row(
        children: [
          const Icon(Icons.warning_amber, color: Colors.white, size: 20),
          SizedBox(width: 12.w),
          Expanded(
            child: Text(
              '2 faux diplômes détectés ce mois — Soyez vigilant.',
              style: TextStyle(color: Colors.white, fontSize: 11.sp, fontWeight: FontWeight.bold),
            ),
          ),
          const Icon(Icons.chevron_right, color: Colors.white),
        ],
      ),
    );
  }

  Widget _buildHistoryList() {
    return Obx(() {
      if (controller.history.isEmpty) {
        return Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(Icons.history_outlined, size: 64.sp, color: AppColors.textGrey.withOpacity(0.3)),
              SizedBox(height: 16.h),
              Text(
                'Aucun historique trouvé',
                style: TextStyle(color: AppColors.textGrey, fontSize: 14.sp),
              ),
            ],
          ),
        );
      }

      return ListView.builder(
        padding: EdgeInsets.symmetric(horizontal: 16.w),
        itemCount: controller.history.length,
        itemBuilder: (context, index) {
          final item = controller.history[index];
          final isAuthentic = item['status'] == 'Authentique';
          
          return Card(
            margin: EdgeInsets.only(bottom: 12.h),
            child: ListTile(
              onTap: () {
                Get.toNamed(Routes.RESULT, arguments: item['rawData']);
              },
              title: Text(
                item['name'] ?? 'Inconnu',
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
              subtitle: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(item['degree'] ?? 'Diplôme'),
                  Text('${item['date']} • ${item['school']}', style: TextStyle(fontSize: 10.sp)),
                ],
              ),
              trailing: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                crossAxisAlignment: CrossAxisAlignment.end,
                children: [
                  Container(
                    padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                    decoration: BoxDecoration(
                      color: isAuthentic ? AppColors.success.withOpacity(0.1) : AppColors.error.withOpacity(0.1),
                      borderRadius: BorderRadius.circular(4.r),
                    ),
                    child: Text(
                      item['status'] ?? 'N/A',
                      style: TextStyle(
                        fontSize: 10.sp,
                        color: isAuthentic ? AppColors.success : AppColors.error,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
                  SizedBox(height: 4.h),
                  const Icon(Icons.chevron_right, size: 16, color: AppColors.textGrey),
                ],
              ),
            ),
          );
        },
      );
    });
  }
}
