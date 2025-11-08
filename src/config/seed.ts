import { Gender, PrismaClient, UserRole } from '@prisma/client';
import { PasswordUtil } from '../utils/password/password.util';

const prisma = new PrismaClient();

async function main() {
    const adminRole = await prisma.role.upsert({
        where: { name: 'ADMIN' },
        update: {},
        create: { name: 'ADMIN', desc: 'Master Administrator' }
    })

    const userRole = await prisma.role.upsert({
        where: { name: 'USER' },
        update: {},
        create: { name: 'USER', desc: 'Standard User' },
    })


    await prisma.user.upsert({
        where: { email: 'master@master.com' },
        update: { password: await PasswordUtil.hashPassword('Abc@12345') }, 
        create: {
            firstName: 'Master',
            lastName: 'Admin',
            username: 'Admin',
            phone: '0123456789',
            age: 20,
            emailVerified: true,
            gender: Gender.male,
            email: 'master@master.com',
            password: await PasswordUtil.hashPassword('Abc@12345'),

            userRoles: {
                create: [
                    {
                        role: { connect: { id: adminRole.id } }
                    }
                ]
            }
        }
    });
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });