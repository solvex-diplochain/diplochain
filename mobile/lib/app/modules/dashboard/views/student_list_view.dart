import 'package:flutter/material.dart';
import 'package:flutter_screenutil/flutter_screenutil.dart';
import 'package:get/get.dart';
import 'package:mobileblock/app/core/theme/app_colors.dart';
import 'package:mobileblock/app/modules/dashboard/controllers/dashboard_controller.dart';

class StudentListView extends GetView<DashboardController> {
  const StudentListView({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Mes Étudiants')),
      body: FutureBuilder(
        future: controller.apiService.getStudents(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }
          if (!snapshot.hasData || (snapshot.data as Response).body['data'] == null) {
            return const Center(child: Text('Aucun étudiant trouvé'));
          }
          
          final List students = (snapshot.data as Response).body['data'];
          
          return ListView.builder(
            itemCount: students.length,
            padding: EdgeInsets.all(16.w),
            itemBuilder: (context, index) {
              final s = students[index];
              return Card(
                child: ListTile(
                  leading: CircleAvatar(child: Text(s['firstName'][0])),
                  title: Text('${s['firstName']} ${s['lastName']}'),
                  subtitle: Text(s['email']),
                  trailing: const Icon(Icons.chevron_right),
                ),
              );
            },
          );
        },
      ),
    );
  }
}
