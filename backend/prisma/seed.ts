import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seeding...');

  // Create modules
  console.log('Creating modules...');
  const modules = await Promise.all([
    prisma.modulo.upsert({
      where: { codigo: 'ADMIN' },
      update: {},
      create: {
        nombre: 'Administración',
        codigo: 'ADMIN',
        descripcion: 'Acceso completo al sistema',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'FICHAS_SOCIALES_READ' },
      update: {},
      create: {
        nombre: 'Ver Fichas Sociales',
        codigo: 'FICHAS_SOCIALES_READ',
        descripcion: 'Permiso para ver fichas sociales',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'FICHAS_SOCIALES_WRITE' },
      update: {},
      create: {
        nombre: 'Gestionar Fichas Sociales',
        codigo: 'FICHAS_SOCIALES_WRITE',
        descripcion: 'Permiso para crear y editar fichas sociales',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'FICHAS_SOCIALES_DELETE' },
      update: {},
      create: {
        nombre: 'Eliminar Fichas Sociales',
        codigo: 'FICHAS_SOCIALES_DELETE',
        descripcion: 'Permiso para eliminar fichas sociales',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'ENTREVISTAS_READ' },
      update: {},
      create: {
        nombre: 'Ver Entrevistas',
        codigo: 'ENTREVISTAS_READ',
        descripcion: 'Permiso para ver entrevistas aplicadas',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'ENTREVISTAS_WRITE' },
      update: {},
      create: {
        nombre: 'Gestionar Entrevistas',
        codigo: 'ENTREVISTAS_WRITE',
        descripcion: 'Permiso para crear y editar entrevistas',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'USUARIOS_READ' },
      update: {},
      create: {
        nombre: 'Ver Usuarios',
        codigo: 'USUARIOS_READ',
        descripcion: 'Permiso para ver usuarios del sistema',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'USUARIOS_WRITE' },
      update: {},
      create: {
        nombre: 'Gestionar Usuarios',
        codigo: 'USUARIOS_WRITE',
        descripcion: 'Permiso para crear y editar usuarios',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'REPORTES' },
      update: {},
      create: {
        nombre: 'Generar Reportes',
        codigo: 'REPORTES',
        descripcion: 'Permiso para generar reportes del sistema',
        activo: true,
      },
    }),
    prisma.modulo.upsert({
      where: { codigo: 'AUDITORIA' },
      update: {},
      create: {
        nombre: 'Ver Auditoría',
        codigo: 'AUDITORIA',
        descripcion: 'Permiso para ver logs de auditoría',
        activo: true,
      },
    }),
  ]);

  console.log(`Created ${modules.length} modules`);

  // Create roles
  console.log('Creating roles...');
  const adminRole = await prisma.rol.upsert({
    where: { nombre: 'Administrador' },
    update: {},
    create: {
      nombre: 'Administrador',
      descripcion: 'Rol con acceso completo al sistema',
      es_sistema: true,
      activo: true,
    },
  });

  const supervisorRole = await prisma.rol.upsert({
    where: { nombre: 'Supervisor' },
    update: {},
    create: {
      nombre: 'Supervisor',
      descripcion: 'Rol con permisos de supervisión',
      es_sistema: false,
      activo: true,
    },
  });

  const trabajadorSocialRole = await prisma.rol.upsert({
    where: { nombre: 'Trabajador Social' },
    update: {},
    create: {
      nombre: 'Trabajador Social',
      descripcion: 'Rol para trabajadores sociales',
      es_sistema: false,
      activo: true,
    },
  });

  const visitadorSocialRole = await prisma.rol.upsert({
    where: { nombre: 'Visitador Social' },
    update: {},
    create: {
      nombre: 'Visitador Social',
      descripcion: 'Rol para visitadores sociales',
      es_sistema: false,
      activo: true,
    },
  });

  // Assign modules to roles
  console.log('Assigning modules to roles...');

  // Admin gets all permissions
  const adminModuleAssignments = modules.map(module => ({
    rol_id: adminRole.id,
    modulo_id: module.id,
  }));

  // Supervisor gets most permissions except user management and system config
  const supervisorModuleCodes = [
    'ADMIN',
    'FICHAS_SOCIALES_READ',
    'FICHAS_SOCIALES_WRITE',
    'ENTREVISTAS_READ',
    'ENTREVISTAS_WRITE',
    'REPORTES',
    'AUDITORIA',
  ];
  const supervisorModuleAssignments = modules
    .filter(module => supervisorModuleCodes.includes(module.codigo))
    .map(module => ({
      rol_id: supervisorRole.id,
      modulo_id: module.id,
    }));

  // Trabajador Social gets fichas and interviews permissions
  const trabajadorSocialModuleCodes = [
    'FICHAS_SOCIALES_READ',
    'FICHAS_SOCIALES_WRITE',
    'ENTREVISTAS_READ',
    'ENTREVISTAS_WRITE',
  ];
  const trabajadorSocialModuleAssignments = modules
    .filter(module => trabajadorSocialModuleCodes.includes(module.codigo))
    .map(module => ({
      rol_id: trabajadorSocialRole.id,
      modulo_id: module.id,
    }));

  // Visitador Social gets read permissions only
  const visitadorSocialModuleCodes = [
    'FICHAS_SOCIALES_READ',
    'ENTREVISTAS_READ',
  ];
  const visitadorSocialModuleAssignments = modules
    .filter(module => visitadorSocialModuleCodes.includes(module.codigo))
    .map(module => ({
      rol_id: visitadorSocialRole.id,
      modulo_id: module.id,
    }));

  await prisma.rolModulo.createMany({
    data: [
      ...adminModuleAssignments,
      ...supervisorModuleAssignments,
      ...trabajadorSocialModuleAssignments,
      ...visitadorSocialModuleAssignments,
    ],
    skipDuplicates: true,
  });

  console.log('Role-module assignments created');

  // Create admin user
  console.log('Creating admin user...');
  const hashedPassword = await bcrypt.hash('Admin123!', 12);

  const adminUser = await prisma.usuario.upsert({
    where: { email: 'admin@siges.com' },
    update: {},
    create: {
      email: 'admin@siges.com',
      password: hashedPassword,
      nombres: 'Administrador',
      apellidos: 'Sistema',
      dni: '12345678',
      telefono: '999999999',
      activo: true,
      email_verificado: true,
      rol_id: adminRole.id,
    },
  });

  console.log(`Admin user created: ${adminUser.email}`);

  // Create sample users
  console.log('Creating sample users...');
  const samplePassword = await bcrypt.hash('Usuario123!', 12);

  await prisma.usuario.upsert({
    where: { email: 'supervisor@siges.com' },
    update: {},
    create: {
      email: 'supervisor@siges.com',
      password: samplePassword,
      nombres: 'Juan',
      apellidos: 'Pérez',
      dni: '87654321',
      telefono: '888888888',
      activo: true,
      email_verificado: true,
      rol_id: supervisorRole.id,
    },
  });

  await prisma.usuario.upsert({
    where: { email: 'trabajador@siges.com' },
    update: {},
    create: {
      email: 'trabajador@siges.com',
      password: samplePassword,
      nombres: 'María',
      apellidos: 'González',
      dni: '11223344',
      telefono: '777777777',
      activo: true,
      email_verificado: true,
      rol_id: trabajadorSocialRole.id,
    },
  });

  console.log('Sample users created');

  console.log('\nDatabase seeding completed successfully!');
  console.log('\n=== CREDENTIALS ===');
  console.log('Admin User:');
  console.log('  Email: admin@siges.com');
  console.log('  Password: Admin123!');
  console.log('\nSupervisor User:');
  console.log('  Email: supervisor@siges.com');
  console.log('  Password: Usuario123!');
  console.log('\nTrabajador Social User:');
  console.log('  Email: trabajador@siges.com');
  console.log('  Password: Usuario123!');
  console.log('==================\n');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });