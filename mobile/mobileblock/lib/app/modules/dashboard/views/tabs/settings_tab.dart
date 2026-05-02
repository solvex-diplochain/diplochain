import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import '../../../../core/theme/app_colors.dart';
import '../../controllers/dashboard_controller.dart';

class SettingsTab extends GetView<DashboardController> {
  const SettingsTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildOrganizationProfile(),
          SizedBox(height: 24.h),
          _buildTeamSection(),
          SizedBox(height: 24.h),
          _buildDangerZone(),
          SizedBox(height: 40.h),
          _buildLogoutButton(),
        ],
      ),
    );
  }

  Widget _buildOrganizationProfile() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                CircleAvatar(
                  radius: 30.r,
                  backgroundColor: AppColors.background,
                  child: const Icon(Icons.business, color: AppColors.darkBlue, size: 30),
                ),
                SizedBox(width: 16.w),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Entreprise ABC', style: TextStyle(fontSize: 18.sp, fontWeight: FontWeight.bold)),
                      Text('Technologies de l\'information', style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey)),
                    ],
                  ),
                ),
                IconButton(onPressed: () {}, icon: const Icon(Icons.edit, size: 20)),
              ],
            ),
            SizedBox(height: 24.h),
            _buildInfoRow('Identifiant', 'REC-BF-0124'),
            _buildInfoRow('Plan actuel', 'Plan Gratuit', isPremium: false),
            _buildInfoRow('Membres', '3 / 5'),
            SizedBox(height: 24.h),
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {},
                child: const Text('Enregistrer les modifications'),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildInfoRow(String label, String value, {bool isPremium = false}) {
    return Padding(
      padding: EdgeInsets.only(bottom: 12.h),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(fontSize: 12.sp, color: AppColors.textGrey)),
          Container(
            padding: EdgeInsets.symmetric(horizontal: 8.w, vertical: 2.h),
            decoration: isPremium ? BoxDecoration(
              color: Colors.amber.withOpacity(0.1),
              borderRadius: BorderRadius.circular(4.r),
            ) : null,
            child: Text(
              value,
              style: TextStyle(
                fontSize: 12.sp,
                fontWeight: FontWeight.bold,
                color: isPremium ? Colors.amber.shade900 : AppColors.textDark,
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildTeamSection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text('Membres de l\'équipe', style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold)),
            TextButton(onPressed: () {}, child: const Text('+ Ajouter')),
          ],
        ),
        Card(
          child: ListView.separated(
            shrinkWrap: true,
            physics: const NeverScrollableScrollPhysics(),
            itemCount: 3,
            separatorBuilder: (context, index) => const Divider(height: 1),
            itemBuilder: (context, index) {
              final members = [
                {'name': 'Marie Compaoré', 'role': 'Admin', 'status': 'Actif'},
                {'name': 'Jean Traoré', 'role': 'Membre', 'status': 'Actif'},
                {'name': 'Aminata Ouédraogo', 'role': 'Membre', 'status': 'En attente'},
              ];
              final m = members[index];
              return ListTile(
                title: Text(m['name']!, style: TextStyle(fontSize: 13.sp, fontWeight: FontWeight.bold)),
                subtitle: Text(m['role']!, style: TextStyle(fontSize: 11.sp)),
                trailing: Text(
                  m['status']!,
                  style: TextStyle(
                    fontSize: 11.sp,
                    color: m['status'] == 'Actif' ? AppColors.success : Colors.amber.shade700,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );
  }

  Widget _buildDangerZone() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text('Zone de danger', style: TextStyle(fontSize: 16.sp, fontWeight: FontWeight.bold, color: AppColors.error)),
        SizedBox(height: 12.h),
        Card(
          color: AppColors.error.withOpacity(0.05),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(12.r),
            side: const BorderSide(color: AppColors.error, width: 0.5),
          ),
          child: ListTile(
            leading: const Icon(Icons.delete_forever, color: AppColors.error),
            title: Text('Supprimer le compte', style: TextStyle(color: AppColors.error, fontWeight: FontWeight.bold)),
            subtitle: Text('Cette action est irréversible', style: TextStyle(fontSize: 11.sp)),
            onTap: () {},
          ),
        ),
      ],
    );
  }

  Widget _buildLogoutButton() {
    return SizedBox(
      width: double.infinity,
      child: OutlinedButton.icon(
        onPressed: () => Get.offAllNamed('/landing'),
        style: OutlinedButton.styleFrom(
          foregroundColor: AppColors.error,
          side: const BorderSide(color: AppColors.error),
        ),
        icon: const Icon(Icons.logout),
        label: const Text('Se déconnecter'),
      ),
    );
  }
}
