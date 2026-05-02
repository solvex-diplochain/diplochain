import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';

class HistoryTab extends GetView<DashboardController> {
  const HistoryTab({super.key});

  @override
  Widget build(BuildContext context) {
    return Column(
      children: [
        _buildHeaderStats(),
        _buildFilters(),
        _buildAlertBanner(),
        Expanded(
          child: _buildHistoryList(),
        ),
      ],
    );
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
    return Padding(
      padding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 8.h),
      child: Column(
        children: [
          TextField(
            decoration: InputDecoration(
              hintText: 'Rechercher un candidat...',
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
                _buildFilterChip('Authentiques', false),
                _buildFilterChip('Faux diplômes', false),
                _buildFilterChip('Ce mois', false),
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
    return ListView.builder(
      padding: EdgeInsets.symmetric(horizontal: 16.w),
      itemCount: 10, // Mock count
      itemBuilder: (context, index) {
        final isFake = index == 3; // Mock one fake entry
        return Card(
          margin: EdgeInsets.only(bottom: 12.h),
          child: ListTile(
            onTap: () => Get.toNamed('/result'),
            title: Text(
              isFake ? 'TRAORÉ Ibrahim' : 'OUÉDRAOGO Fatimata',
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
            subtitle: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(isFake ? 'BTS Comptabilité' : 'Licence Informatique'),
                Text('24/04/2026 • Par Marie C.', style: TextStyle(fontSize: 10.sp)),
              ],
            ),
            trailing: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              crossAxisAlignment: CrossAxisAlignment.end,
              children: [
                Container(
                  padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 4.h),
                  decoration: BoxDecoration(
                    color: isFake ? AppColors.error.withOpacity(0.1) : AppColors.success.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(4.r),
                  ),
                  child: Text(
                    isFake ? 'Faux' : 'Authentique',
                    style: TextStyle(
                      fontSize: 10.sp,
                      color: isFake ? AppColors.error : AppColors.success,
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
  }
}
