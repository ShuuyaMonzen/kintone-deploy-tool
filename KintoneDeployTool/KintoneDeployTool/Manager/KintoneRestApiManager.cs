using KintoneDeployTool.Common;
using KintoneDeployTool.DataAccess.DomainModel;
using KintoneDeployTool.Utils;
using KintoneDeployTool.ViewModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.IO.Compression;
using System.Linq;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using static KintoneDeployTool.DataAccess.Const.CodeConst;
using static KintoneDeployTool.Manager.KintoneRestApiManager.DependencyResolvedItem;
using static System.Net.WebRequestMethods;

namespace KintoneDeployTool.Manager
{
    public partial class KintoneRestApiManager
    {
        public class CheckResult
        {
            public bool IsError { get; set; }

            public bool IsWarn { get; set; }

            public bool IsInfo { get; set; }

            public bool IsNoProblem
            {
                get
                {
                    return !IsError && !IsWarn && !IsInfo;
                }
            }

            public string Message { get; set; }

        }

        #region HttpRequest共通
        private static readonly string AuthenticationSchema = "X-Cybozu-Authorization";
        private static string GetURL(MstKintoneEnviroment mstKintoneEnviroment)
        {
            return "https://" + mstKintoneEnviroment.SubDomain + ".cybozu.com/k/v1/";
        }

        private static string GetHost(MstKintoneEnviroment mstKintoneEnviroment)
        {
            return mstKintoneEnviroment.SubDomain + ".cybozu.com:443";
        }

        private static string GetUsrPassBase64(MstKintoneEnviroment mstKintoneEnviroment)
        {
            return Base64Util.Encode(mstKintoneEnviroment.UserID + ":" +
                mstKintoneEnviroment.Password);
        }

        private static void SetBasicOption(HttpClient client, MstKintoneEnviroment mstKintoneEnviroment)
        {
            client.DefaultRequestHeaders.Accept.Clear();
            client.BaseAddress = new Uri(GetURL(mstKintoneEnviroment));
            client.DefaultRequestHeaders.Add(AuthenticationSchema, GetUsrPassBase64(mstKintoneEnviroment));
            client.DefaultRequestHeaders.Host = GetHost(mstKintoneEnviroment);
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
        }
        #endregion

        #region 共通
        public class RequestParam
        {
            public int AppId
            {
                get
                {
                    return (SiteKind == SiteKindEnum.DeployFrom) ?
                        MstDeployFromToInfo.DeployFromMstKintoneApp.AppId :
                        MstDeployFromToInfo.DeployToMstKintoneApp.AppId;
                }
            }

            public MstKintoneEnviroment MstKintoneEnviroment
            {
                get
                {
                    return (SiteKind == SiteKindEnum.DeployFrom) ?
                        MstDeployFromToInfo.DeployFromMstKintoneApp.MstKintoneEnviroment :
                        MstDeployFromToInfo.DeployToMstKintoneApp.MstKintoneEnviroment;
                }
            }

            public MstDeployFromToInfo MstDeployFromToInfo { get; set; }
            public SiteKindEnum SiteKind { get; set; }
            public KintoneJsonKind JsonKind { get; set; }
        }


        /// <summary>
        /// kintoneのREST通信の共通メソッド(GET)
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private static async Task<string> KintoneGetAsync(RequestParam param, string query = null)
        {
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);
            var requestUri = GetRequestUriStr(param.JsonKind, param.AppId);
            var response = await client.GetAsync(
                requestUri +
                (requestUri.Contains("?") ?
                    (string.IsNullOrEmpty(query) ? "" : ("&query=" + query)) :
                    query)
                );
            var jsonStr = await response.Content.ReadAsStringAsync();
            ThrowExceptionOnError(response);
            return jsonStr;
        }

        private static async Task<string> KintoneGetAsync(MstKintoneEnviroment mstKintoneEnviroment, string query = null)
        {
            using var client = new HttpClient();
            SetBasicOption(client, mstKintoneEnviroment);
            var response = await client.GetAsync(GetRequestUriStr(KintoneJsonKind.Apps) +
                ((string.IsNullOrEmpty(query)) ? "" : ("?" + query)));
            var jsonStr = await response.Content.ReadAsStringAsync();
            ThrowExceptionOnError(response);
            return jsonStr;
        }



        private static async Task<string> GetAppsAll(MstKintoneEnviroment mstKintoneEnviroment)
        {
            var allApps = new JArray();

            while (true)
            {
                try
                {
                    var query = "offset=" + allApps.Count + "&limit=100";
                    var jsonStr = await KintoneGetAsync(mstKintoneEnviroment, query);
                    var jobj = JObject.Parse(jsonStr);
                    var apps = jobj["apps"].ToObject<List<JObject>>();
                    var appsCnt = apps.Count;

                    if (appsCnt == 0)
                    {
                        break;
                    }
                    apps.ForEach(x => allApps.Add(x));
                }
                catch
                {
                    return null;
                }
            }
            return allApps.ToString();
        }

        /// <summary>
        /// kintoneのREST通信(GET, ファイルダウンロード)
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private static async Task<string> KintoneGetFileAsync(RequestParam param, string fileKey)
        {
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);
            var response = await client.GetAsync(GetRequestUriStr(param.JsonKind, param.AppId) + fileKey);
            var jsonStr = await response.Content.ReadAsStringAsync();
            ThrowExceptionOnError(response);
            return jsonStr;
        }

        /// <summary>
        /// kintoneのREST通信(GET, ファイルダウンロード)
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private static async Task<Stream> KintoneGetFileStreamAsync(RequestParam param, string fileKey)
        {
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);
            var response = await client.GetAsync(GetRequestUriStr(param.JsonKind, param.AppId) + fileKey);
            var stream = await response.Content.ReadAsStreamAsync();
            ThrowExceptionOnError(response);
            return stream;
        }

        /// <summary>
        /// kintoneのREST通信の共通メソッド(PUT)
        /// </summary>
        /// <param name="param"></param>
        /// <param name="jsonStr"></param>
        /// <returns></returns>
        private static async Task KintonePutAsync(RequestParam param, string jsonStr)
        {
            if (string.IsNullOrEmpty(jsonStr))
            {
                throw new Exception("jsonがnullもしくは空文字です。");
            }
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);

            var content = new StringContent(jsonStr, Encoding.UTF8, "application/json");

            var response =
                await client.PutAsync(GetRequestUriStr(param.JsonKind, param.AppId), content);

            ThrowExceptionOnError(response);
        }

        /// <summary>
        /// kintoneのREST通信の共通メソッド(POST)
        /// </summary>
        /// <param name="param"></param>
        /// <param name="jsonStr"></param>
        /// <returns></returns>
        private static async Task KintonePostAsync(RequestParam param, string jsonStr)
        {
            if (string.IsNullOrEmpty(jsonStr))
            {
                throw new Exception("jsonがnullもしくは空文字です。");
            }
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);

            var content = new StringContent(jsonStr, Encoding.UTF8, "application/json");

            var response =
                await client.PostAsync(GetRequestUriStr(param.JsonKind, param.AppId), content);

            ThrowExceptionOnError(response);
        }

        /// <summary>
        /// kintoneのREST通信(POST, ファイルアップロード)
        /// </summary>
        /// <param name="param"></param>
        /// <param name="jsonStr"></param>
        /// <returns></returns>
        private static async Task<string> KintonePostFileAsync(RequestParam param, string filePath)
        {
            string fileName = Path.GetFileName(filePath);

            using var client = new HttpClient();
            using var fs = new FileStream(filePath, FileMode.Open, FileAccess.Read);
            SetBasicOption(client, param.MstKintoneEnviroment);
            //送信先のURL
            string url = client.BaseAddress + GetRequestUriStr(KintoneJsonKind.FileUpload);


            MultipartFormDataContent content = new MultipartFormDataContent();
            StreamContent streamContent = new StreamContent(fs);
            streamContent.Headers.ContentDisposition =
                   new ContentDispositionHeaderValue("form-data")
                   {
                       Name = "file",
                       FileName = fileName
                   };
            streamContent.Headers.ContentType =
                     new MediaTypeHeaderValue("text/javascript");
            content.Add(streamContent);

            // メソッド (POST) と送信先の URL 指定
            HttpRequestMessage request =
                     new HttpRequestMessage(HttpMethod.Post, url);
            request.Content = content;

            var response = await client.SendAsync(request);
            var jsonStr = await response.Content.ReadAsStringAsync();
            ThrowExceptionOnError(response);

            var fileKey = JObject.Parse(jsonStr).GetValue("fileKey").ToString();
            return fileKey;
        }

        /// <summary>
        /// kintoneのREST通信(DELETE, フォーム項目)
        /// </summary>
        /// <param name="param"></param>
        /// <param name="jsonStr"></param>
        /// <returns></returns>
        private static async Task KintoneDeleteAsync(RequestParam param, string deleteUri)
        {
            if (string.IsNullOrEmpty(deleteUri))
            {
                throw new Exception("uriがnullもしくは空文字です。");
            }
            using var client = new HttpClient();
            SetBasicOption(client, param.MstKintoneEnviroment);

            var response = await client.DeleteAsync(deleteUri);

            ThrowExceptionOnError(response);
        }

        /// <summary>
        /// HTTP通信のURIを返す
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private static string GetRequestUriStr(KintoneJsonKind kintoneJsonKind, int? id = null)
        {
            string requestUri = null;
            switch (kintoneJsonKind)
            {
                case KintoneJsonKind.Apps:
                    requestUri = "apps.json";
                    break;
                case KintoneJsonKind.Space:
                    requestUri = "space.json?" + GetSpaceRequestParam(id.Value);
                    break;
                case KintoneJsonKind.Setting:
                    requestUri = "app/settings.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.SettingPreview:
                    requestUri = "preview/app/settings.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ProcessKanri:
                    requestUri = "app/status.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ProcessKanriPreview:
                    requestUri = "preview/app/status.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.PartsList:
                    requestUri = "app/form/fields.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.PartsListPreview:
                    requestUri = "preview/app/form/fields.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.PartsLayout:
                    requestUri = "app/form/layout.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.PartsLayoutPreview:
                    requestUri = "preview/app/form/layout.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ListViews:
                    requestUri = "app/views.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ListViewsPreview:
                    requestUri = "preview/app/views.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.Deploy:
                    requestUri = "preview/app/deploy.json";
                    break;
                case KintoneJsonKind.CustomizeFilePreview:
                    requestUri = "preview/app/customize.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.CustomizeFile:
                    requestUri = "app/customize.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.FileDownload:
                    requestUri = "file.json?fileKey=";
                    break;
                case KintoneJsonKind.FileUpload:
                    requestUri = "file.json";
                    break;
                case KintoneJsonKind.Graph:
                    requestUri = "app/reports.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.GraphPreview:
                    requestUri = "preview/app/reports.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppNotification:
                    requestUri = "app/notifications/general.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppNotificationPreview:
                    requestUri = "preview/app/notifications/general.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.RecordNotification:
                    requestUri = "app/notifications/perRecord.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.RecordNotificationPreview:
                    requestUri = "preview/app/notifications/perRecord.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppPermission:
                    requestUri = "app/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppPermissionPreview:
                    requestUri = "preview/app/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ReminderNotification:
                    requestUri = "app/notifications/reminder.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.ReminderNotificationPreview:
                    requestUri = "preview/app/notifications/reminder.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.RecordPermission:
                    requestUri = "record/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.RecordPermissionPreview:
                    requestUri = "preview/record/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.FieldPermission:
                    requestUri = "field/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.FieldPermissionPreview:
                    requestUri = "preview/field/acl.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppAction:
                    requestUri = "app/actions.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.AppActionPreview:
                    requestUri = "preview/app/actions.json?" + GetAppRequestParam(id.Value);
                    break;
                case KintoneJsonKind.Records:
                    requestUri = "records.json?" + GetAppRequestParam(id.Value);
                    break;
            }
            return requestUri;
        }

        /// <summary>
        /// HTTP通信に必要なリクエストパラメータを返す(アプリ)
        /// (URL末尾に?app=xxxを追加)
        /// </summary>
        /// <param name="param"></param>
        /// <returns></returns>
        private static string GetAppRequestParam(int appId)
        {
            var parameters = new Dictionary<string, string>()
            {
                { "app",  appId.ToString() },
             };

            return (new FormUrlEncodedContent(parameters)).ReadAsStringAsync().Result;
        }

        /// <summary>
        /// HTTP通信に必要なリクエストパラメータを返す(スペース)
        /// (URL末尾に?space=xxxを追加)
        /// </summary>
        /// <param name="param"></param>
        private static string GetSpaceRequestParam(int spaceId)
        {
            var parameters = new Dictionary<string, string>()
            {
                { "id", spaceId.ToString() },
             };

            return (new FormUrlEncodedContent(parameters)).ReadAsStringAsync().Result;
        }

        /// <summary>
        /// JSONからRevisionを削除する
        /// </summary>
        /// <param name="jsonStr"></param>
        /// <returns></returns>
        private static string GetJsonDeletedRevision(string jsonStr)
        {
            var json = JObject.Parse(jsonStr);
            json.Remove("revision");
            return json.ToString();
        }

        /// <summary>
        /// JSONにアプリIDを追加する
        /// </summary>
        /// <param name="jsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static string GetJsonAddedAppId(string jsonStr, int appId)
        {
            var json = JObject.Parse(jsonStr);
            json.Remove("app");
            json.Add("app", appId.ToString());
            return json.ToString();
        }


        /// <summary>
        /// HTTP通信に失敗しているときにリクエストと結果を表示し例外をスローする
        /// </summary>
        /// <param name="response"></param>
        private static void ThrowExceptionOnError(HttpResponseMessage response)
        {
            if (!response.IsSuccessStatusCode)
            {
                string errorMsg = response.RequestMessage + "\r\n" + response.Content.ReadAsStringAsync().Result;
                throw new Exception(errorMsg);
            }
        }
        #endregion

        #region 各設定のデプロイ
        #region 一般設定
        public static void GeneralSettingDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                GeneralSettingDeploy(mstDeployFromToInfo);
            }
        }

        public static void GeneralSettingDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.Setting
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.SettingPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region 一覧のデプロイ
        public static void ListViewDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                ListViewDeploy(mstDeployFromToInfo);
            }
        }

        public static void ListViewDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.ListViews
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ListViewsPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region フォーム部品情報



        /// <summary>
        /// 「アプリを更新」の操作が必要か返す
        /// </summary>
        /// <param name="mstDeployPreset"></param>
        /// <returns></returns>
        public static async Task<CheckResult> GetComfirmMessage(DeployViewModel vm, MstDeployPreset mstDeployPreset)
        {
            var result = new CheckResult();

            if (vm.UrlKind != "auto_deploy" &&
                vm.UrlKind != "form_deploy" &&
                vm.UrlKind != "restore_backup")
            {
                return result;
            }

            var dependencyResolvedItem = await GetDependencyResolvedItemAsync(mstDeployPreset);

            bool requiredApplyDeploy = dependencyResolvedItem.DependentOnOtherAppItems.Any();
            bool hasAppMapping = (mstDeployPreset.MstKintoneAppMapping != null);

            if (requiredApplyDeploy && hasAppMapping)
            {
                result.IsWarn = true;
                result.Message = "自動の操作内に「アプリを更新」が含まれます。よろしいですか？";
            }
            else if (requiredApplyDeploy && !hasAppMapping)
            {
                result.IsError = true;
                result.Message = "アプリマッピングが指定されていないため、参照項目(ルックアップ,関連レコード一覧)のデプロイができません。";
            }

            return result;
        }

        public static async Task FormPartsDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            var dependencyResolvedItem = await GetDependencyResolvedItemAsync(mstDeployPreset);
            bool requiredApplyDeploy = dependencyResolvedItem.DependentOnOtherAppItems.Any();

            //項目(関連テーブル・ルックアップ・計算以外)追加・更新・削除
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                await FormPartsDeploy(mstDeployFromToInfo);
            }
            dependencyResolvedItem.SetProcessedPrecedentItems();

            if (!(dependencyResolvedItem.GetItemsOfCanAddOrUpdate()?.Any() ?? false))
            {
                return;
            }

            //デプロイ適用
            if (requiredApplyDeploy)
            {
                await DeployApplyAllApp(mstDeployPreset);
            }

            while (dependencyResolvedItem.GetItemsOfCanAddOrUpdate()?.Any() ?? false)
            {
                foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
                {
                    await FormPartsDeployDependItem(mstDeployFromToInfo, dependencyResolvedItem);
                }

                var itemsOfCanAddOrUpdate = dependencyResolvedItem.GetItemsOfCanAddOrUpdate();
                foreach (var item in itemsOfCanAddOrUpdate)
                {
                    dependencyResolvedItem.SetProcessedItem(item.AppId, item.FieldCode);
                }

                //デプロイ適用
                if (requiredApplyDeploy)
                {
                    await DeployApplyAllApp(mstDeployPreset);
                }
            }
        }
        public static async Task FormPartsDeleteDependItemDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.PartsList
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.PartsListPreview
            };

            string fromFormPartsJson = backupJson ?? await KintoneGetAsync(fromParam);
            string toFormPartsJson = await KintoneGetAsync(toParam);
            await DeleteFormDependItemAsync(fromFormPartsJson, toFormPartsJson, toParam);
        }

        public static async Task FormPartsDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.PartsList
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.PartsListPreview
            };
            var mstKintoneAppMapping = mstDeployFromToInfo.MstDeployPreset.MstKintoneAppMapping;

            string fromFormPartsJson = backupJson ?? KintoneGetAsync(fromParam).Result;
            string toFormPartsJson = KintoneGetAsync(toParam).Result;
            await DeleteFormPartsAsync(fromFormPartsJson, toFormPartsJson, toParam);

            fromFormPartsJson = backupJson ?? KintoneGetAsync(fromParam).Result;
            toFormPartsJson = KintoneGetAsync(toParam).Result;
            string deployLayoutJsonInsert = GetInsertFormPartsJson(fromFormPartsJson, toFormPartsJson, mstDeployFromToInfo, mstKintoneAppMapping);
            if (!string.IsNullOrEmpty(deployLayoutJsonInsert))
            {
                await KintonePostAsync(toParam, deployLayoutJsonInsert);
            }

            fromFormPartsJson = backupJson ?? KintoneGetAsync(fromParam).Result;
            toFormPartsJson = KintoneGetAsync(toParam).Result;
            string deployLayoutJsonUpdate = GetUpdateFormPartsJson(fromFormPartsJson, toFormPartsJson, mstDeployFromToInfo, mstKintoneAppMapping);
            if (!string.IsNullOrEmpty(deployLayoutJsonUpdate))
            {
                await KintonePutAsync(toParam, deployLayoutJsonUpdate);
            }
        }

        public static async Task FormPartsDeployDependItem(MstDeployFromToInfo mstDeployFromToInfo, DependencyResolvedItem dependencyResolvedItem, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.PartsList
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.PartsListPreview
            };

            var itemsOfCanAddOrUpdate = dependencyResolvedItem.GetItemsOfCanAddOrUpdate();
            var mstKintoneAppMapping = mstDeployFromToInfo.MstDeployPreset.MstKintoneAppMapping;


            var fromFormPartsJson = backupJson ?? KintoneGetAsync(fromParam).Result;
            var toFormPartsJson = KintoneGetAsync(toParam).Result;
            var deployLayoutJsonInsert = GetInsertFormPartsJsonDependItem(fromFormPartsJson, toFormPartsJson,
                mstDeployFromToInfo, mstKintoneAppMapping,
                itemsOfCanAddOrUpdate);
            if (!string.IsNullOrEmpty(deployLayoutJsonInsert))
            {
                await KintonePostAsync(toParam, deployLayoutJsonInsert);
            }

            fromFormPartsJson = backupJson ?? KintoneGetAsync(fromParam).Result;
            toFormPartsJson = KintoneGetAsync(toParam).Result;
            var deployLayoutJsonUpdate = GetUpdateFormPartsJsonDependItem(fromFormPartsJson, toFormPartsJson,
                mstDeployFromToInfo, mstKintoneAppMapping,
                itemsOfCanAddOrUpdate);
            if (!string.IsNullOrEmpty(deployLayoutJsonUpdate))
            {
                await KintonePutAsync(toParam, deployLayoutJsonUpdate);
            }
        }

        #region フォーム部品用
        /// <summary>
        /// 更新する対象のフォーム部品をJsonにまとめる
        /// 対象:fromJsonStrとtoJsonStrの両方に存在するフォーム部品
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static string GetUpdateFormPartsJson(string fromJsonStr, string toJsonStr, MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping)
        {
            var resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var toJsonObj = (JObject)JObject.Parse(toJsonStr)["properties"];

            //更新対象のフィールドコード,フィールドタイプのリスト
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr)
                .Intersect(GetFieldCodeFieldTypePairs(toJsonStr)).ToList();
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブルは別処理で行う
            fieldCodeFieldTypePairs = fieldCodeFieldTypePairs.Where(x => !subTableKeys.Contains(x.Key)).ToList();

            #region サブテーブル以外の項目を更新する
            //fromにあってToにもあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                   (val?["lookup"] != null))
                {
                    continue;
                }

                if (fieldType == "USER_SELECT" ||
                    fieldType == "GROUP_SELECT" ||
                    fieldType == "ORGANIZATION_SELECT")
                {
                    val.Remove("defaultValue");
                    val.Add("defaultValue", (JArray)toJsonObj[fieldCode]["defaultValue"]);
                }
                resultJson.Add(fieldCode, val);
            }
            #endregion

            #region サブテーブルの項目更新
            //サブテーブル内の更新対象のフィールドコード,フィールドタイプのリスト
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)
                .Intersect(GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)fromJsonObj[subtableKey]["fields"][fieldCode];
                    if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                        (val?["lookup"] != null))
                    {
                        continue;
                    }


                    if (resultJson[subtableKey] == null)
                    {
                        resultJson.Add(subtableKey, fromJsonObj[subtableKey]);
                        ((JObject)resultJson[subtableKey]).Remove("fields");
                        ((JObject)resultJson[subtableKey]).Add("fields", JObject.Parse("{}"));
                    }
                    if (fieldType == "USER_SELECT" ||
                    fieldType == "GROUP_SELECT" ||
                    fieldType == "ORGANIZATION_SELECT")
                    {
                        val.Remove("defaultValue");
                        val.Add("defaultValue", (JArray)toJsonObj[subtableKey]["fields"][fieldCode]["defaultValue"]);
                    }

                    ((JObject)resultJson[subtableKey]["fields"]).Add(fieldCode, val);
                }
            }
            #endregion

            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //更新する項目がなし
                return null;
            }

            var returnJson = JObject.Parse(fromJsonStr);
            returnJson.Remove("properties");
            returnJson.Add("properties", resultJson);

            var returnJsonStr = returnJson.ToString();
            returnJsonStr = GetJsonDeletedRevision(returnJsonStr);
            returnJsonStr = GetJsonAddedAppId(returnJsonStr, mstDeployFromToInfo.DeployToMstKintoneApp.AppId);
            return returnJsonStr;
        }

        /// <summary>
        /// 更新する対象のフォーム部品をJsonにまとめる
        /// 対象:fromJsonStrとtoJsonStrの両方に存在するフォーム部品
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static string GetUpdateFormPartsJsonDependItem(string fromJsonStr, string toJsonStr,
            MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping,
            List<FormItem> itemsOfCanAddOrUpdate)
        {
            var resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var toJsonObj = (JObject)JObject.Parse(toJsonStr)["properties"];

            //更新対象のフィールドコード,フィールドタイプのリスト
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr)
                .Intersect(GetFieldCodeFieldTypePairs(toJsonStr)).ToList();
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブルは別処理で行う
            fieldCodeFieldTypePairs = fieldCodeFieldTypePairs.Where(x => !subTableKeys.Contains(x.Key)).ToList();

            #region サブテーブル以外の項目を更新する
            //fromにあってToにもあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if (!itemsOfCanAddOrUpdate.Where(x => x.AppId == mstDeployFromToInfo.DeployFromMstKintoneApp.AppId &&
                    x.FieldCode == fieldCode).Any())
                {
                    continue;
                }

                if (fieldType == "REFERENCE_TABLE")
                {
                    val = ReplaceAppIdReferenceTableOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                }
                else if (val?["lookup"] != null)
                {
                    val = ReplaceAppIdLookUpOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                }
                resultJson.Add(fieldCode, val);
            }
            #endregion

            #region サブテーブルの項目更新
            //サブテーブル内の更新対象のフィールドコード,フィールドタイプのリスト
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)
                .Intersect(GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)fromJsonObj[subtableKey]["fields"][fieldCode];
                    if (!itemsOfCanAddOrUpdate.Where(x => x.AppId == mstDeployFromToInfo.DeployFromMstKintoneApp.AppId &&
                    x.FieldCode == fieldCode).Any())
                    {
                        continue;
                    }
                    if (fieldType == "REFERENCE_TABLE")
                    {
                        val = ReplaceAppIdReferenceTableOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                    }
                    else if (val?["lookup"] != null)
                    {
                        val = ReplaceAppIdLookUpOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                    }
                    ((JObject)resultJson[subtableKey]["fields"]).Add(fieldCode, val);
                }
            }
            #endregion

            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //更新する項目がなし
                return null;
            }

            var returnJson = JObject.Parse(fromJsonStr);
            returnJson.Remove("properties");
            returnJson.Add("properties", resultJson);

            var returnJsonStr = returnJson.ToString();
            returnJsonStr = GetJsonDeletedRevision(returnJsonStr);
            returnJsonStr = GetJsonAddedAppId(returnJsonStr, mstDeployFromToInfo.DeployToMstKintoneApp.AppId);
            return returnJsonStr;
        }

        /// <summary>
        /// 追加する対象のフォーム部品をJsonにまとめる
        /// 対象:fromJsonStrにあってtoJsonStrにないフォーム部品
        /// 対象外:関連テーブル、ルックアップ
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static string GetInsertFormPartsJson(string fromJsonStr, string toJsonStr,
            MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping)
        {
            var resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr)
                .Except(GetFieldCodeFieldTypePairs(toJsonStr)).ToList();

            #region サブテーブル以外の項目を追加
            //fromにだけあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                    (val?["lookup"] != null))
                {
                    continue;
                }

                if (fieldType == "USER_SELECT" ||
                    fieldType == "GROUP_SELECT" ||
                    fieldType == "ORGANIZATION_SELECT")
                {
                    val.Remove("defaultValue");
                }
                resultJson.Add(fieldCode, val);
            }
            #endregion

            #region サブテーブルの項目追加
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブル内のフィールドキー
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)
                .Except(GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)fromJsonObj[subtableKey]["fields"][fieldCode];
                    if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                        (val?["lookup"] != null))
                    {
                        continue;
                    }

                    if (resultJson[subtableKey] == null)
                    {
                        resultJson.Add(subtableKey, fromJsonObj[subtableKey]);
                        ((JObject)resultJson[subtableKey]).Remove("fields");
                        ((JObject)resultJson[subtableKey]).Add("fields", JObject.Parse("{}"));
                    }
                    if (fieldType == "USER_SELECT" ||
                    fieldType == "GROUP_SELECT" ||
                    fieldType == "ORGANIZATION_SELECT")
                    {
                        val.Remove("defaultValue");
                    }

                    ((JObject)resultJson[subtableKey]["fields"]).Add(fieldCode, val);
                }
            }
            #endregion


            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //追加する項目なし
                return null;
            }


            var returnJson = JObject.Parse(fromJsonStr);
            returnJson.Remove("properties");
            returnJson.Add("properties", resultJson);

            var returnJsonStr = returnJson.ToString();
            returnJsonStr = GetJsonDeletedRevision(returnJsonStr);
            returnJsonStr = GetJsonAddedAppId(returnJsonStr, mstDeployFromToInfo.DeployToMstKintoneApp.AppId);
            return returnJsonStr;
        }

        /// <summary>
        /// 追加する対象のフォーム部品をJsonにまとめる
        /// 対象:fromJsonStrにあってtoJsonStrにないフォーム部品(関連テーブル、ルックアップのみ)
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static string GetInsertFormPartsJsonDependItem(string fromJsonStr, string toJsonStr,
            MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping,
            List<FormItem> itemsOfCanAddOrUpdate)
        {
            var resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr)
                .Except(GetFieldCodeFieldTypePairs(toJsonStr)).ToList();

            #region サブテーブル以外の項目を追加
            //fromにだけあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if (!itemsOfCanAddOrUpdate.Where(x => x.AppId == mstDeployFromToInfo.DeployFromMstKintoneApp.AppId &&
                    x.FieldCode == fieldCode).Any())
                {
                    continue;
                }
                if (fieldType == "REFERENCE_TABLE")
                {
                    val = ReplaceAppIdReferenceTableOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                }
                else if (val?["lookup"] != null)
                {
                    val = ReplaceAppIdLookUpOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                }
                resultJson.Add(fieldCode, val);
            }
            #endregion

            #region サブテーブルの項目追加
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブル内のフィールドキー
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)
                .Except(GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)fromJsonObj[subtableKey]["fields"][fieldCode];
                    if (!itemsOfCanAddOrUpdate.Where(x => x.AppId == mstDeployFromToInfo.DeployFromMstKintoneApp.AppId &&
                    x.FieldCode == fieldCode).Any())
                    {
                        continue;
                    }
                    if (fieldType == "REFERENCE_TABLE")
                    {
                        val = ReplaceAppIdReferenceTableOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                    }
                    else if (val?["lookup"] != null)
                    {
                        val = ReplaceAppIdLookUpOfDeployFrom(val, mstDeployFromToInfo, mstKintoneAppMapping);
                    }

                    if (resultJson[subtableKey] == null)
                    {
                        resultJson.Add(subtableKey, fromJsonObj[subtableKey]);
                        ((JObject)resultJson[subtableKey]).Remove("fields");
                        ((JObject)resultJson[subtableKey]).Add("fields", JObject.Parse("{}"));
                    }

                    ((JObject)resultJson[subtableKey]["fields"]).Add(fieldCode, val);
                }
            }
            #endregion


            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //追加する項目なし
                return null;
            }


            var returnJson = JObject.Parse(fromJsonStr);
            returnJson.Remove("properties");
            returnJson.Add("properties", resultJson);

            var returnJsonStr = returnJson.ToString();
            returnJsonStr = GetJsonDeletedRevision(returnJsonStr);
            returnJsonStr = GetJsonAddedAppId(returnJsonStr, mstDeployFromToInfo.DeployToMstKintoneApp.AppId);
            return returnJsonStr;
        }

        /// <summary>
        /// 対象:fromJsonStrになくtoJsonStrにあるフォーム部品(フィールドコード,フィールドタイプで一意として扱う)
        /// 対象外:関連テーブル、ルックアップ
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static async Task DeleteFormPartsAsync(string fromJsonStr, string toJsonStr, RequestParam param)
        {
            JObject resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var toJsonObj = (JObject)JObject.Parse(toJsonStr)["properties"];
            var fromFieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr);
            var toFieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(toJsonStr);

            var fieldCodeFieldTypePairs = toFieldCodeFieldTypePairs.Except(fromFieldCodeFieldTypePairs).ToList();

            #region サブテーブル以外の項目を削除
            //Toにだけあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                        (val?["lookup"] != null))
                {
                    continue;
                }
                resultJson.Add(fieldCode, toJsonObj.GetValue(fieldCode));
            }
            #endregion

            #region サブテーブルの項目削除
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブル内のフィールドキー
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)
                .Except(GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)toJsonObj[subtableKey]["fields"][fieldCode];
                    if ((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                        (val?["lookup"] != null))
                    {
                        continue;
                    }
                    resultJson.Add(fieldCode, val);
                }
            }
            #endregion

            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //削除する項目なし
                return;
            }

            var fieldCodes = resultJson.Properties().Select(p => p.Name).ToArray();
            var query = "";
            for (int i = 0; i < fieldCodes.Length; i++)
            {
                query += "&fields[" + i + "]=" + fieldCodes[i];
            }
            var uri = GetRequestUriStr(KintoneJsonKind.PartsListPreview, param.AppId) + query;
            await KintoneDeleteAsync(param, uri);
        }

        /// <summary>。
        /// 対象:fromJsonStrになくtoJsonStrにあるフォーム部品(フィールドコード,フィールドタイプで一意として扱う)
        /// 対象:関連テーブル、ルックアップ
        /// </summary>
        /// <param name="fromJsonStr"></param>
        /// <param name="toJsonStr"></param>
        /// <param name="appId"></param>
        /// <returns></returns>
        private static async Task DeleteFormDependItemAsync(string fromJsonStr, string toJsonStr, RequestParam param)
        {
            var resultJson = new JObject();
            var fromJsonObj = (JObject)JObject.Parse(fromJsonStr)["properties"];
            var toJsonObj = (JObject)JObject.Parse(toJsonStr)["properties"];
            var fromFieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(fromJsonStr);
            var toFieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(toJsonStr);

            var fieldCodeFieldTypePairs = toFieldCodeFieldTypePairs.Except(fromFieldCodeFieldTypePairs).ToList();

            #region サブテーブル以外の項目を削除
            //Toにだけあるもの
            foreach (var fieldCodeFieldTypePair in fieldCodeFieldTypePairs)
            {
                var fieldCode = fieldCodeFieldTypePair.Key;
                var fieldType = fieldCodeFieldTypePair.Value;
                var val = (JObject)fromJsonObj[fieldCode];
                if (!((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                    (val?["lookup"] != null)))
                {
                    continue;
                }
                resultJson.Add(fieldCode, toJsonObj.GetValue(fieldCode));
            }
            #endregion

            #region サブテーブルの項目削除
            //両方にあるサブテーブルのフィールドコード
            var subTableKeys = GetSubTableFieldCodes(fromJsonStr).Intersect(GetSubTableFieldCodes(toJsonStr)).ToList();
            //サブテーブル内のフィールドキー
            var fieldCodeFieldTypePairsInSubtable = GetFieldCodeFieldTypeInSubTablePairs(toJsonStr, subTableKeys)
                .Except(GetFieldCodeFieldTypeInSubTablePairs(fromJsonStr, subTableKeys)).ToList();

            foreach (var subtableKey in subTableKeys)
            {
                foreach (var fieldCodeFieldTypePairInSubtable in fieldCodeFieldTypePairsInSubtable)
                {
                    var fieldCode = fieldCodeFieldTypePairInSubtable.Key;
                    var fieldType = fieldCodeFieldTypePairInSubtable.Value;
                    var val = (JObject)toJsonObj[subtableKey]["fields"][fieldCode];
                    if (!((fieldType == "REFERENCE_TABLE") || (fieldType == "CALC") ||
                        (val?["lookup"] != null)))
                    {
                        continue;
                    }
                    resultJson.Add(fieldCode, val);
                }
            }
            #endregion

            if (!fieldCodeFieldTypePairs.Any() && !fieldCodeFieldTypePairsInSubtable.Any())
            {
                //削除する項目なし
                return;
            }

            var fieldCodes = resultJson.Properties().Select(p => p.Name).ToArray();
            var query = "";
            for (int i = 0; i < fieldCodes.Length; i++)
            {
                query += "&fields[" + i + "]=" + fieldCodes[i];
            }
            var uri = GetRequestUriStr(KintoneJsonKind.PartsListPreview, param.AppId) + query;
            await KintoneDeleteAsync(param, uri);
        }

        private static List<KeyValuePair<string, string>> GetFieldCodeFieldTypePairs(string jsonStr)
        {
            var jsonObj = (JObject)JObject.Parse(jsonStr)["properties"];
            var fieldCodes = jsonObj.Properties().Select(p => p.Name).ToList();
            var fieldCodeFieldTypePairs = fieldCodes.Select(key => new KeyValuePair<string, string>(key, jsonObj[key]["type"].ToString()))
                .OrderBy(x => x.Key).ToList();

            return fieldCodeFieldTypePairs;
        }

        private static List<string> GetSubTableFieldCodes(string jsonStr)
        {
            var jsonObj = (JObject)JObject.Parse(jsonStr)["properties"];
            var fieldCodeFieldTypePairs = GetFieldCodeFieldTypePairs(jsonStr);

            var subTableFieldCodes = fieldCodeFieldTypePairs.Where(fieldCodeFieldTypePair =>
                fieldCodeFieldTypePair.Value == "SUBTABLE")
                .Select(x => x.Key).ToList();
            return subTableFieldCodes;
        }

        private static List<KeyValuePair<string, string>> GetFieldCodeFieldTypeInSubTablePairs(string jsonStr, List<string> subTableFieldCodes)
        {
            var jsonObj = (JObject)JObject.Parse(jsonStr)["properties"];
            var fieldCodeFieldTypeInSubTablePairs = new List<KeyValuePair<string, string>>();
            subTableFieldCodes.ForEach(key =>
            {
                var fieldCodesInSubTable = ((JObject)jsonObj[key]["fields"]).Properties().Select(p => p.Name);
                fieldCodeFieldTypeInSubTablePairs.AddRange(fieldCodesInSubTable.Select(fieldCodeInSubTable =>
                    new KeyValuePair<string, string>(fieldCodeInSubTable, jsonObj[key]["fields"][fieldCodeInSubTable]["type"].ToString())));
            });
            fieldCodeFieldTypeInSubTablePairs = fieldCodeFieldTypeInSubTablePairs.OrderBy(x => x.Key).ToList();
            return fieldCodeFieldTypeInSubTablePairs;
        }

        private static JObject ReplaceAppIdReferenceTableOfDeployFrom(JObject jObject, MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping)
        {
            var srcAppId = jObject["referenceTable"]["relatedApp"]["app"].Value<int>();
            var subDomain = mstDeployFromToInfo.DeployFromMstKintoneApp.MstKintoneEnviroment.SubDomain;

            var isEnviroment1 = mstKintoneAppMapping.MstKintoneEnviroment1.SubDomain == subDomain;

            if ((isEnviroment1 && !mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp1.AppId == srcAppId).Any()) ||
                (!isEnviroment1 && !mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp2.AppId == srcAppId).Any()))
            {
                throw new Exception("マッピング定義にないアプリを参照する関連テーブルがあります");
            }

            var appId = (isEnviroment1 ?
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp1.AppId == srcAppId).Single().MstKintoneApp2.AppId :
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp2.AppId == srcAppId).Single().MstKintoneApp1.AppId);

            jObject["referenceTable"]["relatedApp"] = JToken.Parse("{\"app\":\"" + appId + "\"}");

            return jObject;
        }

        private static JObject ReplaceAppIdLookUpOfDeployFrom(JObject jObject, MstDeployFromToInfo mstDeployFromToInfo, MstKintoneAppMapping mstKintoneAppMapping)
        {
            var srcAppId = jObject["lookup"]["relatedApp"]["app"].Value<int>();
            var subDomain = mstDeployFromToInfo.DeployFromMstKintoneApp.MstKintoneEnviroment.SubDomain;

            var isEnviroment1 = mstKintoneAppMapping.MstKintoneEnviroment1.SubDomain == subDomain;

            if ((isEnviroment1 && !mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp1.AppId == srcAppId).Any()) ||
                !mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp2.AppId == srcAppId).Any())
            {
                throw new Exception("マッピング定義にないアプリを参照するルックアップがあります");
            }

            var appId = (isEnviroment1 ?
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp1.AppId == srcAppId).Single().MstKintoneApp2.AppId :
                mstKintoneAppMapping.MstKintoneAppMappingDetails.Where(x => x.MstKintoneApp2.AppId == srcAppId).Single().MstKintoneApp1.AppId);

            jObject["lookup"]["relatedApp"] = JToken.Parse("{\"app\":\"" + appId + "\"}");

            return jObject;
        }
        #endregion
        #endregion

        #region フォームレイアウト情報
        public static async Task FormLayoutDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                await FormLayoutDeploy(mstDeployFromToInfo);
            }
        }

        public static async Task FormLayoutDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.PartsLayout
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.PartsLayoutPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            await KintonePutAsync(toParam, deployJsonStr);
        }
        #endregion

        #region プロセス管理
        public static async Task ProcessDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                await ProcessDeploy(mstDeployFromToInfo);
            }
        }
        public static async Task ProcessDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.ProcessKanri
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ProcessKanriPreview
            };

            string fromProcessInfoJsonStr = backupJson ?? await KintoneGetAsync(fromParam);
            string toProcessInfoJsonStr = backupJson ?? await KintoneGetAsync(toParam);
            if (string.IsNullOrEmpty(backupJson))
            {
                fromProcessInfoJsonStr = DeletePersonInfo(fromProcessInfoJsonStr);
                fromProcessInfoJsonStr = SetOriginFirstStateName(toProcessInfoJsonStr, fromProcessInfoJsonStr);
            }

            fromProcessInfoJsonStr = GetJsonDeletedRevision(fromProcessInfoJsonStr);
            fromProcessInfoJsonStr = GetJsonAddedAppId(fromProcessInfoJsonStr, toParam.AppId);

            await KintonePutAsync(toParam, fromProcessInfoJsonStr);
        }
        private static string DeletePersonInfo(string processInfoJsonStr)
        {
            var statesJson = (JObject.Parse(processInfoJsonStr)).GetValue("states") as JObject;
            if (statesJson == null)
            {
                return processInfoJsonStr;
            }
            var statusNames = statesJson.Properties().Select(x => x.Name);

            var resultJson = JObject.Parse(processInfoJsonStr);
            resultJson.Remove("states");
            foreach (var statusName in statusNames)
            {
                ((JObject)statesJson.GetValue(statusName)).Remove("assignee");
            }
            resultJson.Add("states", statesJson);
            return resultJson.ToString();
        }

        private static string SetOriginFirstStateName(string toProcessInfoJsonStr, string fromProcessInfoJsonStr)
        {
            var toStatesJson = (JObject.Parse(toProcessInfoJsonStr)).GetValue("states") as JObject;
            var fromStatesJson = (JObject.Parse(fromProcessInfoJsonStr)).GetValue("states") as JObject;
            if (fromStatesJson == null ||
                toStatesJson == null)
            {
                return fromProcessInfoJsonStr;
            }


            var fromStatesNameIndexs = new Dictionary<string, int>();
            fromStatesJson.Properties().Select(x => x.Name).ToList().ForEach(statusName =>
            {
                fromStatesNameIndexs.Add(statusName, fromStatesJson[statusName]["index"].ToObject<int>());
            });

            var toStatesNameIndexs = new Dictionary<string, int>();
            toStatesJson.Properties().Select(x => x.Name).ToList().ForEach(statusName =>
            {
                toStatesNameIndexs.Add(statusName, toStatesJson[statusName]["index"].ToObject<int>());
            });
            var toFirstStatesName = toStatesNameIndexs.Where(x => x.Value == 0).Single().Key;



            var resultJson = JObject.Parse(fromProcessInfoJsonStr);
            resultJson.Remove("states");

            var resultStates = new JObject();
            foreach (var statusNameIndex in fromStatesNameIndexs.OrderBy(x => x.Value))
            {
                var statusName = statusNameIndex.Key;
                var index = statusNameIndex.Value;
                if (index == 0)
                {
                    resultStates.Add(toFirstStatesName, (JObject)fromStatesJson.GetValue(statusName));
                }
                else
                {
                    resultStates.Add(statusName, (JObject)fromStatesJson.GetValue(statusName));
                }

            }



            resultJson.Add("states", resultStates);
            return resultJson.ToString();
        }
        #endregion

        #region グラフのデプロイ
        public static void GraphDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                GraphDeploy(mstDeployFromToInfo);
            }
        }

        public static void GraphDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.Graph
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.GraphPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region アプリの条件通知
        public static void AppNotificationDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                AppNotificationDeploy(mstDeployFromToInfo);
            }
        }

        public static void AppNotificationDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.AppNotification
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.AppNotificationPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region レコードの条件通知
        public static void RecordNotificationDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                RecordNotificationDeploy(mstDeployFromToInfo);
            }
        }

        public static void RecordNotificationDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.RecordNotification
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.RecordNotificationPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            if (string.IsNullOrEmpty(backupJson))
            {
                deployJsonStr = DeleteNotifyTarget(deployJsonStr);
            }
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region リマインダーの条件通知
        public static void ReminderNotificationDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                ReminderNotificationDeploy(mstDeployFromToInfo);
            }
        }

        public static void ReminderNotificationDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.ReminderNotification
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ReminderNotificationPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            if (string.IsNullOrEmpty(backupJson))
            {
                deployJsonStr = DeleteNotifyTarget(deployJsonStr);
            }
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }

        private static string DeleteNotifyTarget(string json)
        {
            var notificationsJson = (JObject.Parse(json)).GetValue("notifications") as JArray;
            if (notificationsJson == null)
            {
                return json;
            }


            foreach (JObject item in notificationsJson)
            {
                item.Remove("targets");
                item.Add("targets", JArray.Parse("[]"));
            }

            var resultJson = JObject.Parse(json);
            resultJson.Remove("notifications");
            resultJson.Add("notifications", notificationsJson);
            return resultJson.ToString();
        }

        #endregion

        #region カスタマイズファイルのデプロイ
        public static void CustomizeFilesDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                var fromParam = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployFrom,
                    JsonKind = KintoneJsonKind.CustomizeFile
                };
                var tempDirectoryPath = CreateTempDirectory(mstDeployFromToInfo);
                fromParam.JsonKind = KintoneJsonKind.CustomizeFile;
                DownloadCustomizeFiles(tempDirectoryPath, fromParam);

                var toParam = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployTo,
                    JsonKind = KintoneJsonKind.CustomizeFilePreview
                };
                UploadCustomizeFiles(toParam, tempDirectoryPath);
            }
        }

        public static string CreateTempDirectory(MstDeployFromToInfo mstDeployFromToInfo)
        {
            string tempDirectoryPath = Path.Combine(Directory.GetCurrentDirectory(), "temp");
            if (Directory.Exists(tempDirectoryPath))
            {
                Directory.Delete(tempDirectoryPath, true);
            }
            tempDirectoryPath = Path.Combine(tempDirectoryPath, mstDeployFromToInfo.DeployFromMstKintoneAppID.ToString());
            Directory.CreateDirectory(tempDirectoryPath);
            return tempDirectoryPath;
        }

        private class CustomizeFileInfo
        {
            public string device;
            public string fileKind;
            public string fileType;
            public string url;
            public string fileKey;
        }
        public static void UploadCustomizeFiles(RequestParam param, string tempDirectoryPath)
        {
            var fileInfos = new List<CustomizeFileInfo>();
            var fileKeys = new List<string>();
            string[] deviceArray = { "desktop", "mobile" };
            string[] customizeFileArray = { "js", "css" };


            foreach (var device in deviceArray)
            {
                foreach (var customizeFile in customizeFileArray)
                {
                    string directoryPath = Path.Combine(tempDirectoryPath, device, customizeFile);
                    IEnumerable<string> files = Directory.EnumerateFiles(directoryPath, "*", SearchOption.AllDirectories);

                    foreach (var file in files)
                    {
                        string fileName = Path.GetFileName(file);
                        if (fileName == "urlPath.txt")
                        {
                            using (StreamReader sr = new StreamReader(file))
                            {
                                string line;
                                while ((line = sr.ReadLine()) != null)
                                {
                                    fileInfos.Add(new CustomizeFileInfo()
                                    {
                                        device = device,
                                        fileKind = customizeFile,
                                        fileKey = "",
                                        fileType = "URL",
                                        url = line
                                    });
                                }
                            }
                        }
                        else
                        {
                            param.JsonKind = KintoneJsonKind.FileUpload;
                            var fileKey = KintonePostFileAsync(param, file).Result;
                            fileInfos.Add(new CustomizeFileInfo()
                            {
                                device = device,
                                fileKind = customizeFile,
                                fileKey = fileKey,
                                fileType = "FILE",
                                url = ""
                            });
                        }
                    }

                }
            }

            var customizeJson = new
            {
                app = param.AppId,
                scope = "ALL",
                desktop = new
                {
                    js = fileInfos.Where(x => x.device == "desktop" && x.fileKind == "js").Select(x => new
                    {
                        type = x.fileType,
                        x.url,
                        file = new
                        {
                            x.fileKey
                        }
                    }).ToArray(),
                    css = fileInfos.Where(x => x.device == "desktop" && x.fileKind == "css").Select(x => new
                    {
                        type = x.fileType,
                        x.url,
                        file = new
                        {
                            x.fileKey
                        }
                    }).ToArray()
                },
                mobile = new
                {
                    js = fileInfos.Where(x => x.device == "mobile" && x.fileKind == "js").Select(x => new
                    {
                        type = x.fileType,
                        x.url,
                        file = new
                        {
                            x.fileKey
                        }
                    }).ToArray(),
                    css = fileInfos.Where(x => x.device == "mobile" && x.fileKind == "css").Select(x => new
                    {
                        type = x.fileType,
                        x.url,
                        file = new
                        {
                            x.fileKey
                        }
                    }).ToArray()
                }
            };

            param.JsonKind = KintoneJsonKind.CustomizeFilePreview;
            var jsonStr = JObject.FromObject(customizeJson).ToString();
            KintonePutAsync(param, jsonStr).Wait();
        }
        #endregion

        #region アプリのアクセス権
        public static void AppPermissionDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                AppPermissionDeploy(mstDeployFromToInfo);
            }
        }

        public static void AppPermissionDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.AppPermission
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.AppPermissionPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region レコードのアクセス権
        public static void RecordPermissionDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                RecordPermissionDeploy(mstDeployFromToInfo);
            }
        }

        public static void RecordPermissionDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.RecordPermission
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.RecordPermissionPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region フィールドのアクセス権
        public static void FieldPermissionDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                FieldPermissionDeploy(mstDeployFromToInfo);
            }
        }

        public static void FieldPermissionDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.FieldPermission
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.FieldPermissionPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region アプリアクション
        public static void AppActionDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                AppActionDeploy(mstDeployFromToInfo);
            }
        }

        public static void AppActionDeploy(MstDeployFromToInfo mstDeployFromToInfo, string backupJson = null)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.AppAction
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.AppActionPreview
            };

            string deployJsonStr = backupJson ?? KintoneGetAsync(fromParam).Result;
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region デプロイの適用
        public static async Task DeployApplyAllApp(MstDeployPreset mstDeployPreset)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployPreset.MstDeployFromToInfos[0],
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.Deploy
            };

            var firstFlg = true;
            var jsonStr =
                "{" +
                "\"apps\" : " +
                "   [";
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                if (!firstFlg)
                {
                    jsonStr += ", ";
                }
                jsonStr +=
                    "       {" +
                    "           \"app\":" + mstDeployFromToInfo.DeployToMstKintoneApp.AppId + "," +
                    "           \"revision\": -1" +
                    "       }";
                firstFlg = false;
            }
            jsonStr +=
                "   ]" +
                "}";

            var json = JObject.Parse(jsonStr);

            await WaitDeployComplate(mstDeployPreset);
            await KintonePostAsync(toParam, json.ToString());
            await WaitDeployComplate(mstDeployPreset);
        }

        private static async Task WaitDeployComplate(MstDeployPreset mstDeployPreset)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployPreset.MstDeployFromToInfos[0],
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.Deploy
            };

            var allProcessed = true;
            do
            {
                allProcessed = true;
                var query = "";
                for (var i = 0; i < mstDeployPreset.MstDeployFromToInfos.Count; i++)
                {
                    var mstDeployFromToInfo = mstDeployPreset.MstDeployFromToInfos[i];
                    if (!string.IsNullOrEmpty(query))
                    {
                        query += "&";
                    }
                    query += "apps[" + i + "]=" + mstDeployFromToInfo.DeployToMstKintoneApp.AppId;
                }
                query = "?" + query;

                var result = await KintoneGetAsync(toParam, query);
                var resultJson = JObject.Parse(result);
                var apps = (JArray)resultJson["apps"];

                for (var i = 0; i < apps.Count; i++)
                {
                    if ((string)apps[i]["status"] == "PROCESSING")
                    {
                        allProcessed = false;
                    }
                }

            } while (!allProcessed);
        }

        public static void DeployApply(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.Deploy
            };


            var json = JObject.Parse(
                "{" +
                "\"apps\" : " +
                "   [{" +
                "       \"app\":" + toParam.AppId +
                "   }]" +
                "}");

            KintonePostAsync(toParam, json.ToString()).Wait();
        }
        #endregion

        #endregion

        #region 削除系のデプロイ
        #region プロセス管理(削除)
        public static void ProcessDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                ProcessDeleteDeploy(mstDeployFromToInfo);
            }
        }
        public static void ProcessDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ProcessKanriPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedStates(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        private static string GetJsonDeletedStates(string processInfoJsonStr)
        {
            var jsonObj = JObject.Parse(processInfoJsonStr);
            var statesJson = jsonObj.GetValue("states") as JObject;
            if (statesJson == null)
            {
                return processInfoJsonStr;
            }
            jsonObj["enable"] = "false";
            jsonObj.Remove("states");
            jsonObj.Add("states", null);
            return jsonObj.ToString();
        }
        #endregion

        #region 一覧(削除)
        public static void ListViewDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                ListViewDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void ListViewDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ListViewsPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedViews(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        private static string GetJsonDeletedViews(string processInfoJsonStr)
        {
            var jsonObj = JObject.Parse(processInfoJsonStr);
            var viewsJson = jsonObj.GetValue("views") as JObject;
            if (viewsJson == null)
            {
                return processInfoJsonStr;
            }
            jsonObj.Remove("views");
            jsonObj.Add("views", JToken.Parse("{}"));
            return jsonObj.ToString();
        }
        #endregion

        #region グラフのデプロイ(削除)
        public static void GraphDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                GraphDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void GraphDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.GraphPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedReports(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }

        private static string GetJsonDeletedReports(string jsonStr)
        {
            var jsonObj = JObject.Parse(jsonStr);
            var reportsJson = jsonObj.GetValue("reports") as JObject;
            if (reportsJson == null)
            {
                return jsonStr;
            }
            jsonObj.Remove("reports");
            jsonObj.Add("reports", JToken.Parse("{}"));
            return jsonObj.ToString();
        }
        #endregion

        #region アプリの条件通知(削除)
        public static void AppNotificationDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                AppNotificationDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void AppNotificationDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.AppNotificationPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedNotification(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        private static string GetJsonDeletedNotification(string jsonStr)
        {
            var jsonObj = JObject.Parse(jsonStr);
            var notificationsJson = jsonObj.GetValue("notifications") as JObject;
            if (notificationsJson == null)
            {
                return jsonStr;
            }
            jsonObj.Remove("notifications");
            jsonObj.Add("notifications", JToken.Parse("{}"));
            return jsonObj.ToString();
        }
        #endregion

        #region レコードの条件通知(削除)
        public static void RecordNotificationDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                RecordNotificationDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void RecordNotificationDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.RecordNotificationPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedNotification(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }


        #endregion

        #region リマインダーの条件通知(削除)
        public static void ReminderNotificationDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                ReminderNotificationDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void ReminderNotificationDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.ReminderNotificationPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedNotification(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region レコードのアクセス権(削除)
        public static void RecordPermissionDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                RecordPermissionDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void RecordPermissionDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.RecordPermissionPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedRights(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }

        private static string GetJsonDeletedRights(string jsonStr)
        {
            var jsonObj = JObject.Parse(jsonStr);
            var rightsJson = jsonObj.GetValue("rights") as JObject;
            if (rightsJson == null)
            {
                return jsonStr;
            }
            jsonObj.Remove("rights");
            jsonObj.Add("rights", JToken.Parse("{}"));
            return jsonObj.ToString();
        }
        #endregion

        #region フィールドのアクセス権(削除)
        public static void FieldPermissionDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                FieldPermissionDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void FieldPermissionDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.FieldPermissionPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedRights(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }
        #endregion

        #region アプリアクション(削除)
        public static void AppActionDeleteDeployAllApp(MstDeployPreset mstDeployPreset)
        {
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                AppActionDeleteDeploy(mstDeployFromToInfo);
            }
        }

        public static void AppActionDeleteDeploy(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.AppActionPreview
            };

            string deployJsonStr = KintoneGetAsync(toParam).Result;
            deployJsonStr = GetJsonDeletedActions(deployJsonStr);
            deployJsonStr = GetJsonDeletedRevision(deployJsonStr);
            deployJsonStr = GetJsonAddedAppId(deployJsonStr, toParam.AppId);

            KintonePutAsync(toParam, deployJsonStr).Wait();
        }

        private static string GetJsonDeletedActions(string jsonStr)
        {
            var jsonObj = JObject.Parse(jsonStr);
            var rightsJson = jsonObj.GetValue("rights") as JObject;
            if (rightsJson == null)
            {
                return jsonStr;
            }
            jsonObj.Remove("actions");
            jsonObj.Add("actions", JToken.Parse("{}"));
            return jsonObj.ToString();
        }
        #endregion
        #endregion

        #region ver2.0機能
        #region JSONファイル名の取得
        public static string GetJsonFileName(KintoneJsonKind jsonKind)
        {
            string fileName = "";
            switch (jsonKind)
            {
                case KintoneJsonKind.Setting:
                    fileName = "settings.json";
                    break;
                case KintoneJsonKind.ProcessKanri:
                    fileName = "status.json";
                    break;
                case KintoneJsonKind.PartsList:
                    fileName = "fields.json";
                    break;
                case KintoneJsonKind.PartsLayout:
                    fileName = "layout.json";
                    break;
                case KintoneJsonKind.ListViews:
                    fileName = "views.json";
                    break;
                case KintoneJsonKind.CustomizeFile:
                    fileName = "customize.json";
                    break;
                case KintoneJsonKind.Graph:
                    fileName = "graph.json";
                    break;
                case KintoneJsonKind.AppNotification:
                    fileName = "AppNotification.json";
                    break;
                case KintoneJsonKind.RecordNotification:
                    fileName = "recordNotification.json";
                    break;
                case KintoneJsonKind.ReminderNotification:
                    fileName = "reminderNotification.json";
                    break;
                case KintoneJsonKind.AppPermission:
                    fileName = "appPermission.json";
                    break;
                case KintoneJsonKind.RecordPermission:
                    fileName = "recordPermission.json";
                    break;
                case KintoneJsonKind.FieldPermission:
                    fileName = "fieldPermission.json";
                    break;
                case KintoneJsonKind.AppAction:
                    fileName = "appAction.json";
                    break;
                case KintoneJsonKind.Records:
                    fileName = "records.json";
                    break;
            }
            return fileName;
        }
        #endregion

        #region アプリ情報取得
        public static async Task<List<MstKintoneApp>> GetAppInfos(MstKintoneEnviroment mstKintoneEnviroment)
        {
            var mstKintoneApps = new List<MstKintoneApp>();

            var appsJsonStr = await GetAppsAll(mstKintoneEnviroment);

            var apps = JArray.Parse(appsJsonStr).ToObject<List<JObject>>();

            apps.ForEach(app =>
            {
                mstKintoneApps.Add(new MstKintoneApp()
                {
                    AppId = app["appId"].Value<int>(),
                    AppName = app["name"].Value<string>(),
                    MstKintoneEnviromentID = mstKintoneEnviroment.MstKintoneEnviromentID,
                    SpaceId = app.ContainsKey("spaceId") ? app["spaceId"].Value<int?>() : null
                });

            });

            return mstKintoneApps;
        }
        #endregion

        #region アプリのマッピング取得(ver2.0追加機能)
        public static AppMapInfo GetAppMap(MstDeployFromToInfo mstDeployFromToInfo)
        {
            var fromParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployFrom,
                JsonKind = KintoneJsonKind.Space
            };

            var toParam = new RequestParam
            {
                MstDeployFromToInfo = mstDeployFromToInfo,
                SiteKind = SiteKindEnum.DeployTo,
                JsonKind = KintoneJsonKind.Space
            };

            var fromSpaceJsonStr = KintoneGetAsync(fromParam).Result;
            var toSpaceJsonStr = KintoneGetAsync(toParam).Result;

            var result = CreateAppMap(fromSpaceJsonStr, toSpaceJsonStr);

            Console.WriteLine("マッピング成功!!\n");

            return result;
        }

        private static AppMapInfo CreateAppMap(string fromSpaceJsonStr, string toSpaceJsonStr)
        {
            JObject fromSpaceJson = JObject.Parse(fromSpaceJsonStr);
            JObject toSpaceJson = JObject.Parse(toSpaceJsonStr);
            var fromApps = (JArray)fromSpaceJson["attachedApps"];
            var toApps = (JArray)toSpaceJson["attachedApps"];

            var returnVal = new AppMapInfo();
            bool isExistError = false;
            foreach (var fromApp in fromApps)
            {
                var fromAppName = fromApp["name"].ToString();
                var toAppNamesMatchFromApp = toApps.Where(x => x["name"].ToString() == fromAppName);
                bool isExistMatchApp = (toAppNamesMatchFromApp?.Any() ?? false);
                bool isExistMultipleMatchApps = (toAppNamesMatchFromApp.Count() >= 2);
                if (!isExistMatchApp)
                {
                    ConsoleUtil.WriteWarn("「" + fromAppName + "」がデプロイ先に存在しません");
                    isExistError = true;
                }
                else if (isExistMultipleMatchApps)
                {
                    ConsoleUtil.WriteWarn("「" + fromAppName + "」に対応するアプリがデプロイ先に2つ以上存在します");
                    isExistError = true;
                }
                else
                {
                    //fromとtoでアプリ名が1対1でマッチした
                    var toApp = toAppNamesMatchFromApp.First();
                    var toAppName = toApp["name"].ToString();
                    var oneAppMap = new AppMapInfo.AppMap()
                    {
                        FromAppId = int.Parse(fromApp["appId"].ToString()),
                        FromAppName = fromAppName,
                        ToAppId = int.Parse(toApp["appId"].ToString()),
                        ToAppName = toAppName
                    };
                    toApps.Remove(toApp);
                    returnVal.Mapping.Add(oneAppMap);
                }
            }

            if (isExistError)
            {
                ConsoleUtil.ReadEnterKey("上記エラー内容を確認してください。");
                throw new Exception("エラー内容を確認してください。");
            }

            if (toApps.Count() > 0)
            {
                foreach (var toApp in toApps)
                {
                    var toAppName = toApp["name"].ToString();
                    ConsoleUtil.WriteWarn("「" + toAppName + "」がFromに存在しません");
                }

                ConsoleUtil.ReadEnterKey("上記エラー内容を確認してください。");
                throw new Exception("エラー内容を確認してください。");
            }

            return returnVal;
        }
        #endregion

        #region 設定、レコードのバックアップ取得(ver2.0追加機能)
        public static string GetBackupJsons(MstDeployPreset mstDeployPreset, string saveTargetDirectry = null)
        {
            string envDirectoryPath = CreateSaveDirectoryEnv(saveTargetDirectry);
            foreach (var mstDeployFromToInfo in mstDeployPreset.MstDeployFromToInfos)
            {
                string baseDirectoryPath = CreateSaveDirectory(mstDeployFromToInfo, envDirectoryPath, saveTargetDirectry);
                var param = new RequestParam
                {
                    MstDeployFromToInfo = mstDeployFromToInfo,
                    SiteKind = SiteKindEnum.DeployTo
                };

                try
                {
                    param.JsonKind = KintoneJsonKind.Setting;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.ProcessKanri;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.PartsList;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.PartsLayout;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.ListViews;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.Graph;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.AppNotification;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.RecordNotification;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.ReminderNotification;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.AppPermission;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.RecordPermission;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.FieldPermission;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.AppAction;
                    SaveJsonStr(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.CustomizeFile;
                    DownloadCustomizeFiles(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.Records;
                    SaveRecordsJson(baseDirectoryPath, param);

                    param.JsonKind = KintoneJsonKind.FileDownload;
                    DownloadFiles(baseDirectoryPath, param);
                }
                catch (Exception e)
                {
                    ConsoleUtil.WriteWarn("バックアップ保存時にエラーが発生しました。");
                    ConsoleUtil.WriteWarn(e.Message);
                    ConsoleUtil.ReadEnterKey("エラー確認後、終了します。");
                    throw;
                }
            }

            ZipFile.CreateFromDirectory(
                envDirectoryPath,
                envDirectoryPath + ".zip",
                CompressionLevel.Optimal,
                false,
                Encoding.UTF8);
            Directory.Delete(envDirectoryPath, true);

            return envDirectoryPath + ".zip";
        }

        private static string CreateSaveDirectoryEnv(string saveTargetDirectry)
        {
            string envDirectoryPath = saveTargetDirectry ?? Path.Combine(Directory.GetCurrentDirectory(), "backup", DateTime.Now.ToString("yyyy_MM_dd HH_mm_ss_FF"));
            return envDirectoryPath;
        }

        /// <summary>
        /// 保存用のディレクトリを作成する
        /// 作成したディレクトリパスを返す
        /// </summary>
        /// <returns>保存先ディレクトリパス</returns>
        private static string CreateSaveDirectory(MstDeployFromToInfo mstDeployFromToInfo, string envDirectoryPath, string saveTargetDirectry)
        {
            string baseDirectoryPath = envDirectoryPath;
            baseDirectoryPath = Path.Combine(baseDirectoryPath, mstDeployFromToInfo.DeployToMstKintoneApp.AppId.ToString());
            Directory.CreateDirectory(baseDirectoryPath);
            return baseDirectoryPath;
        }

        private static void SaveJsonStr(string baseDirectoryPath, RequestParam requestParam)
        {
            string jsonStr = KintoneGetAsync(requestParam).Result;
            jsonStr = GetJsonDeletedRevision(jsonStr);
            string filePath = CreateJsonFilePath(baseDirectoryPath, requestParam);

            using var sw = new StreamWriter(filePath, false, Encoding.UTF8);
            sw.Write(jsonStr);
        }

        private static string CreateJsonFilePath(string baseDirectoryPath, RequestParam requestParam)
        {
            string filePath = baseDirectoryPath;
            string fileName = GetJsonFileName(requestParam.JsonKind);
            filePath = Path.Combine(filePath, fileName);

            return filePath;
        }

        private static void DownloadCustomizeFiles(string baseDirectoryPath, RequestParam requestParam)
        {
            string jsonStr = KintoneGetAsync(requestParam).Result;
            jsonStr = GetJsonDeletedRevision(jsonStr);
            string filePath = CreateJsonFilePath(baseDirectoryPath, requestParam);

            var json = JObject.Parse(jsonStr);
            string[] deviceArray = { "desktop", "mobile" };
            string[] customizeFileArray = { "js", "css" };



            foreach (var device in deviceArray)
            {
                foreach (var customizeFile in customizeFileArray)
                {
                    string directoryPath = Path.Combine(baseDirectoryPath, device, customizeFile);
                    Directory.CreateDirectory(directoryPath);
                    string jsUrlFilePath = Path.Combine(directoryPath, "urlPath.txt");

                    if (System.IO.File.Exists(jsUrlFilePath))
                    {
                        System.IO.File.Delete(jsUrlFilePath);
                    }

                    var jsArray = (JArray)((JObject)json.GetValue(device)).GetValue(customizeFile);
                    foreach (var js in jsArray)
                    {
                        var jsElement = (JObject)js;
                        var fileInfo = (JObject)jsElement.GetValue("file");
                        var fileType = jsElement.GetValue("type").ToString();
                        if (fileType == "FILE")
                        {
                            var fileKey = fileInfo.GetValue("fileKey").ToString();
                            var fileName = fileInfo.GetValue("name").ToString();
                            requestParam.JsonKind = KintoneJsonKind.FileDownload;
                            string fileStr = KintoneGetFileAsync(requestParam, fileKey).Result;
                            using (var sw = new StreamWriter(Path.Combine(directoryPath, fileName), false, Encoding.UTF8))
                            {
                                sw.Write(fileStr);
                            }
                        }
                        else if (fileType == "URL")
                        {
                            using (var sw = new StreamWriter(jsUrlFilePath, System.IO.File.Exists(jsUrlFilePath), Encoding.UTF8))
                            {
                                var fileUrl = jsElement.GetValue("url").ToString();
                                sw.WriteLine(fileUrl);
                            }
                        }
                    }
                }
            }

        }

        private static void SaveRecordsJson(string baseDirectoryPath, RequestParam requestParam)
        {
            string jsonStr = GetRecordsAll(requestParam);
            string filePath = CreateJsonFilePath(baseDirectoryPath, requestParam);

            using var sw = new StreamWriter(filePath, false, Encoding.UTF8);
            sw.Write(jsonStr);
        }

        private static string GetRecordsAll(RequestParam requestParam)
        {
            var lastRecordId = 0;
            var allRecords = new JArray();

            while (true)
            {
                var query = "$id > " + lastRecordId + "order by $id asc limit 500";
                var jsonStr = KintoneGetAsync(requestParam, query).Result;
                var jobj = JObject.Parse(jsonStr);
                var records = jobj["records"].ToObject<List<JObject>>();

                if (!records.Any())
                {
                    break;
                }
                records.ForEach(x => allRecords.Add(x));

                var lastRecord = records.Last();
                lastRecordId = int.Parse(lastRecord["$id"]["value"].ToString());
            }
            return allRecords.ToString();
        }

        private static void DownloadFiles(string baseDirectoryPath, RequestParam requestParam)
        {
            requestParam.JsonKind = KintoneJsonKind.Records;
            var recordsJsonStr = GetRecordsAll(requestParam);
            var recordsJson = JArray.Parse(recordsJsonStr);
            for (var i = 0; i < recordsJson.Count; i++)
            {
                var record = (JObject)recordsJson[i];
                IList<string> keys = record.Properties().Select(p => p.Name).ToList();
                foreach (var key in keys)
                {
                    if (record[key]["type"].ToString() != "FILE")
                    {
                        continue;
                    }

                    //添付ファイル数分取得をする
                    var targetFiles = (JArray)record[key]["value"];
                    for (var j = 0; j < targetFiles.Count; j++)
                    {
                        var targetFile = targetFiles[j];
                        var fileKey = targetFile["fileKey"].ToString();
                        var fileName = targetFile["name"].ToString();
                        string directoryPath = Path.Combine(baseDirectoryPath, fileKey);
                        Directory.CreateDirectory(directoryPath);
                        var filePath = Path.Combine(directoryPath, fileName);
                        requestParam.JsonKind = KintoneJsonKind.FileDownload;
                        using var stream = KintoneGetFileStreamAsync(requestParam, fileKey).Result;
                        using var outStream = System.IO.File.Create(filePath);
                        stream.CopyTo(outStream);
                    }
                }



            }

            requestParam.JsonKind = KintoneJsonKind.FileDownload;
        }

        #endregion
        #endregion

        public static string ReadBackupJsonStr(string baseDirectoryPath, RequestParam requestParam)
        {
            var fileName = GetJsonFileName(requestParam.JsonKind);
            var filePath = Path.Combine(baseDirectoryPath, fileName);
            using (var sr = new StreamReader(filePath, Encoding.UTF8))
            {

                string str = sr.ReadToEnd();
                return str;
            }
        }
    }
}
