import { Container, decorate, injectable } from "inversify";
import { Controller } from "tsoa";
import { buildProviderModule } from "inversify-binding-decorators";
import { IUserService } from "./services/interfaces/iuser.service";
import { UserService } from "./services/user.service";
import { IUserRepository } from "./repositories/interfaces/iuser.repository";
import { UserRepository } from "./repositories/user.repository";
import { IGenericRepository } from "./repositories/interfaces/igeneric.repository";
import { GenericRepository } from "./repositories/generic.repository";
import { UserController } from "./controllers/user.controller";
import { IAuthService } from "./services/interfaces/iauth.service";
import { AuthService } from "./services/auth.service";
import { AuthController } from "./controllers/auth.controller";
import { Validator } from "class-validator";
import { IRoleRepository } from "./repositories/interfaces/irole.repository";
import { RoleRepository } from "./repositories/role.repository";
import { IUserRoleRepository } from "./repositories/interfaces/iuserRole.repository";
import { UserRoleRepository } from "./repositories/userRole.repository";
import { IRoleService } from "./services/interfaces/irole.service";
import { RoleService } from "./services/role.service";
import { RoleController } from "./controllers/role.controller";
import { AreaController } from "./controllers/area.controller";
import { BuildingController } from "./controllers/building.controller";
import { ZoneController } from "./controllers/zone.controller";
import { ApartmentController } from "./controllers/apartment.controller";
import { IAreaService } from "./services/interfaces/iarea.service";
import { AreaService } from "./services/area.service";
import { IBuildingService } from "./services/interfaces/ibuilding.service";
import { BuildingService } from "./services/building.service";
import { IZoneService } from "./services/interfaces/izone.service";
import { ZoneService } from "./services/zone.service";
import { IApartmentService } from "./services/interfaces/iapartment.service";
import { ApartmentService } from "./services/apartment.service";
import { IAreaRepository } from "./repositories/interfaces/iarea.repository";
import { AreaRepository } from "./repositories/area.repository";
import { IBuildingRepository } from "./repositories/interfaces/ibuilding.repository";
import { BuildingRepository } from "./repositories/building.repository";
import { IZoneRepository } from "./repositories/interfaces/izone.repository";
import { ZoneRepository } from "./repositories/zone.repository";
import { IApartmentRepository } from "./repositories/interfaces/iapartment.repository";
import { ApartmentRepository } from "./repositories/apartment.repository";

const iocContainer = new Container();
decorate(injectable(), Controller); // Makes tsoa's Controller injectable
// Make inversify aware of inversify-binding-decorators
iocContainer.load(buildProviderModule());
// Controller Binding
iocContainer.bind<UserController>(UserController).toSelf();
iocContainer.bind<AuthController>(AuthController).toSelf();
iocContainer.bind<RoleController>(RoleController).toSelf();
iocContainer.bind<AreaController>(AreaController).toSelf();
iocContainer.bind<BuildingController>(BuildingController).toSelf();
iocContainer.bind<ZoneController>(ZoneController).toSelf();
iocContainer.bind<ApartmentController>(ApartmentController).toSelf();

// Service Binding
iocContainer.bind<IUserService>("IUserService").to(UserService);
iocContainer.bind<IAuthService>("IAuthService").to(AuthService);
iocContainer.bind<IRoleService>("IRoleService").to(RoleService);
iocContainer.bind<IAreaService>("IAreaService").to(AreaService);
iocContainer.bind<IBuildingService>("IBuildingService").to(BuildingService)
iocContainer.bind<IZoneService>("IZoneService").to(ZoneService)
iocContainer.bind<IApartmentService>("IApartmentService").to(ApartmentService)

// Repository Binding
iocContainer.bind<IGenericRepository<any>>("IGenericRepository").to(GenericRepository);
iocContainer.bind<IUserRepository>("IUserRepository").to(UserRepository);
iocContainer.bind<IRoleRepository>("IRoleRepository").to(RoleRepository);
iocContainer.bind<IUserRoleRepository>("IUserRoleRepository").to(UserRoleRepository);
iocContainer.bind<IAreaRepository>("IAreaRepository").to(AreaRepository)
iocContainer.bind<IBuildingRepository>("IBuildingRepository").to(BuildingRepository)
iocContainer.bind<IZoneRepository>("IZoneRepository").to(ZoneRepository)
iocContainer.bind<IApartmentRepository>("IApartmentRepository").to(ApartmentRepository)

// Third-party Binding
iocContainer.bind<Validator>(Validator).toSelf();
export { iocContainer };