import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/dashboard_controller.dart';
import 'tabs/overview_tab.dart';
import 'tabs/verify_tab.dart';
import 'tabs/history_tab.dart';
import 'tabs/settings_tab.dart';

class DashboardView extends GetView<DashboardController> {
  const DashboardView({super.key});

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
              style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18.sp),
            ),
          ],
        ),
        actions: [
          const CircleAvatar(
            backgroundColor: Colors.white,
            radius: 16,
            child: Icon(Icons.person, color: AppColors.darkBlue, size: 20),
          ),
          SizedBox(width: 16.w),
        ],
      ),
      body: Obx(() {
        switch (controller.selectedIndex.value) {
          case 0:
            return const OverviewTab();
          case 1:
            return const VerifyTab();
          case 2:
            return const HistoryTab();
          case 3:
            return const SettingsTab();
          default:
            return const OverviewTab();
        }
      }),
      bottomNavigationBar: Obx(() => BottomNavigationBar(
        currentIndex: controller.selectedIndex.value,
        onTap: controller.changeIndex,
        type: BottomNavigationBarType.fixed,
        selectedItemColor: AppColors.primaryOrange,
        unselectedItemColor: AppColors.textGrey,
        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Vérifier'),
          BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historique'),
          BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Paramètres'),
        ],
      )),
      floatingActionButton: FloatingActionButton(
        onPressed: () => controller.changeIndex(1),
        backgroundColor: AppColors.primaryOrange,
        child: const Icon(Icons.add, color: Colors.white),
      ),
    );
  }
}
