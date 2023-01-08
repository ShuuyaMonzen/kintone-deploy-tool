using KintoneDeployTool.DataAccess;
using KintoneDeployTool.DataAccess.AutoSetter;
using KintoneDeployTool.DataAccess.Repository;
using KintoneDeployTool.WorkerServices;
using Microsoft.Extensions.DependencyInjection;

namespace KintoneDeployTool.Common
{
    public static class DependencyInjectionConfig
    {
        public static void SetConfig(IServiceCollection services)
        {
            services.AddTransient<CreatedAutoSetter, CreatedAutoSetter>();
            services.AddTransient<UpdatedAutoSetter, UpdatedAutoSetter>();
            services.AddTransient<AutoSetterManager, AutoSetterManager>();
            services.AddTransient<AppInnerDBContext, AppInnerDBContext>();

            //WorkerService
            services.AddTransient<DeployPresetSelectWorkerService, DeployPresetSelectWorkerService>();
            services.AddTransient<DeployWorkerService, DeployWorkerService>();
            services.AddTransient<MstKintoneEnviromentsWorkerService, MstKintoneEnviromentsWorkerService>();

            //Reposiory
            services.AddTransient<DeployPresetRepository, DeployPresetRepository>();
            services.AddTransient<KintoneAppRepository, KintoneAppRepository>();
            services.AddTransient<KintoneEnviromentRepository, KintoneEnviromentRepository>();


        }
    }
}
