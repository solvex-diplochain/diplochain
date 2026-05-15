import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobileblock/app/core/theme/app_colors.dart';
import 'package:mobileblock/app/modules/dashboard/controllers/dashboard_controller.dart';

class IssueTab extends GetView<DashboardController> {
  const IssueTab({super.key});

  @override
  Widget build(BuildContext context) {
    return SingleChildScrollView(
      padding: EdgeInsets.all(16.w),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            'Émettre un diplôme',
            style: TextStyle(fontSize: 24.sp, fontWeight: FontWeight.bold, color: AppColors.textDark),
          ),
          SizedBox(height: 8.h),
          Text(
            'Enregistrez un nouveau diplôme sur la blockchain',
            style: TextStyle(fontSize: 14.sp, color: AppColors.textGrey),
          ),
          SizedBox(height: 24.h),
          _buildIssueForm(),
        ],
      ),
    );
  }

  Widget _buildIssueForm() {
    return Card(
      child: Padding(
        padding: EdgeInsets.all(16.w),
        child: Column(
          children: [
            _buildField('Email de l\'étudiant', 'Ex: awa@gmail.com', controller.studentEmailController),
            SizedBox(height: 16.h),
            _buildField('Titre du diplôme', 'Ex: Master en Informatique', controller.diplomaTitleController),
            SizedBox(height: 16.h),
            _buildField('Domaine', 'Ex: Intelligence Artificielle', controller.fieldController),
            SizedBox(height: 16.h),
            Row(
              children: [
                Expanded(child: _buildField('Niveau', 'Ex: master', controller.levelController)),
                SizedBox(width: 12.w),
                Expanded(child: _buildField('Mention', 'Ex: excellent', controller.gradeController)),
              ],
            ),
            SizedBox(height: 32.h),
            SizedBox(
              width: double.infinity,
              child: Obx(() => ElevatedButton.icon(
                onPressed: controller.isLoading.value ? null : () {
                  final data = {
                    'studentEmail': controller.studentEmailController.text.trim(),
                    'title': controller.diplomaTitleController.text.trim(),
                    'field': controller.fieldController.text.trim(),
                    'level': controller.levelController.text.trim(),
                    'grade': controller.gradeController.text.trim(),
                    'issueDate': DateTime.now().toIso8601String(),
                  };
                  controller.issueDiploma(data);
                },
                icon: controller.isLoading.value 
                  ? const SizedBox(height: 20, width: 20, child: CircularProgressIndicator(color: Colors.white, strokeWidth: 2))
                  : const Icon(Icons.send),
                label: Text(controller.isLoading.value ? 'Émission...' : 'Émettre sur la Blockchain'),
              )),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildField(String label, String hint, TextEditingController textController) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: TextStyle(fontSize: 12.sp, fontWeight: FontWeight.bold, color: AppColors.textDark),
        ),
        SizedBox(height: 8.h),
        TextField(
          controller: textController,
          decoration: InputDecoration(
            hintText: hint,
            border: OutlineInputBorder(borderRadius: BorderRadius.circular(8.r)),
            contentPadding: EdgeInsets.symmetric(horizontal: 16.w, vertical: 12.h),
          ),
        ),
      ],
    );
  }
}
