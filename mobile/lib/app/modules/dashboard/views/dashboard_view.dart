import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../core/theme/app_colors.dart';
import '../controllers/dashboard_controller.dart';
import 'tabs/overview_tab.dart';
import 'tabs/verify_tab.dart';
import 'tabs/history_tab.dart';
import 'tabs/settings_tab.dart';
import 'tabs/issue_tab.dart';

class DashboardView extends GetView<DashboardController> {
  const DashboardView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Obx(() {
          final role = controller.userRole.value == 'student' ? 'Étudiant' : (controller.userRole.value == 'institution' ? 'Université' : 'Admin');
          return Row(
            children: [
              const Icon(Icons.link, color: Colors.white),
              SizedBox(width: 8.w),
              Text(
                'DiploChain - $role',
                style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18.sp),
              ),
            ],
          );
        }),
        actions: [
          IconButton(
            onPressed: controller.logout,
            icon: const Icon(Icons.logout, color: Colors.white, size: 20),
            tooltip: 'Déconnexion',
          ),
          SizedBox(width: 8.w),
          const CircleAvatar(
            backgroundColor: Colors.white,
            radius: 14,
            child: Icon(Icons.person, color: AppColors.darkBlue, size: 16),
          ),
          SizedBox(width: 16.w),
        ],
      ),
      body: Obx(() {
        final role = controller.userRole.value;
        final index = controller.selectedIndex.value;

        // Dashboard (toujours index 0)
        if (index == 0) return const OverviewTab();

        // Paramètres (toujours le dernier index)
        int lastIndex = 2; // Par défaut (Dashboard, Autre, Paramètres)
        if (role == 'institution' || role == 'employer' || role == 'admin') lastIndex = 3;
        if (index == lastIndex) return const SettingsTab();

        // Onglets intermédiaires selon le rôle
        if (role == 'student') {
          return const HistoryTab(); // Mes Diplômes
        } else if (role == 'institution') {
          if (index == 1) return const IssueTab(); // Onglet Émettre
          if (index == 2) return const HistoryTab(); // Historique
        } else if (role == 'employer') {
          if (index == 1) return const VerifyTab(); // Vérifier
          if (index == 2) return const HistoryTab(); // Historique
        } else {
          // Admin
          if (index == 1) return const HistoryTab(); // Placeholder pour "Institutions"
          if (index == 2) return const HistoryTab(); // Historique
        }

        return const OverviewTab();
      }),
      bottomNavigationBar: Obx(() {
        List<BottomNavigationBarItem> items = [
          const BottomNavigationBarItem(icon: Icon(Icons.dashboard), label: 'Dashboard'),
        ];

        if (controller.userRole.value == 'student') {
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.school), label: 'Mes Diplômes'));
        } else if (controller.userRole.value == 'institution') {
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.add_circle_outline), label: 'Émettre'));
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historique'));
        } else if (controller.userRole.value == 'employer') {
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Vérifier'));
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historique'));
        } else {
          // Admin
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.business), label: 'Institutions'));
          items.add(const BottomNavigationBarItem(icon: Icon(Icons.history), label: 'Historique'));
        }

        items.add(const BottomNavigationBarItem(icon: Icon(Icons.settings), label: 'Paramètres'));

        return BottomNavigationBar(
          currentIndex: controller.selectedIndex.value,
          onTap: controller.changeIndex,
          type: BottomNavigationBarType.fixed,
          selectedItemColor: AppColors.primaryOrange,
          unselectedItemColor: AppColors.textGrey,
          items: items,
        );
      }),
      floatingActionButton: Obx(() => controller.userRole.value == 'student' 
        ? const SizedBox.shrink()
        : FloatingActionButton(
            onPressed: () => controller.changeIndex(1),
            backgroundColor: AppColors.primaryOrange,
            child: const Icon(Icons.add, color: Colors.white),
          ),
      ),
    );
  }
}
