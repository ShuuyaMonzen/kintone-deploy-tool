using KintoneDeployTool.Common;
using KintoneDeployTool.Utils;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

namespace KintoneDeployTool.Service
{
    //バックアップから復旧する。
    public static class RestoreDeployService
    {
       /* public static void Execute(DeployConfig deployConfig)
        {
            List<string> errorList = new List<string>();
            List<string> errorMsgList = new List<string>();
            var backpFolder = SelectFolder();
            foreach (var deployFromTo in deployConfig.DeployList)
            {
                var baseDirectoryPath = Path.Combine(backpFolder, deployFromTo.ToAppId.ToString());
                var param = new RequestParam
                {
                    DeployConfig = deployConfig,
                    FromTo = deployFromTo,
                    SiteKind = SiteKindEnum.DeployTo
                };

                //一時削除
                try
                {
                    KintoneRestApiUtil.ProcessDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.ListViewDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.GraphDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.AppNotificationDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.RecordNotificationDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.ReminderNotificationDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.FieldPermissionDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.RecordPermissionDeleteDeploy(deployFromTo);
                    KintoneRestApiUtil.AppActionDeleteDeploy(deployFromTo);
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("各設定の一時削除");
                }


                //カスタマイズファイル
                try
                {
                    param.JsonKind = KintoneJsonKind.CustomizeFile;
                    KintoneRestApiUtil.UploadCustomizeFiles(param, baseDirectoryPath);
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("カスタマイズファイル");
                }

                //一般設定
                try
                {
                    param.JsonKind = KintoneJsonKind.Setting;
                    SettingDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("一般設定");
                }

                //フィールド
                try
                {
                    param.JsonKind = KintoneJsonKind.PartsList;
                    FormPartsDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("フィールド");
                }

                //プロセス管理
                try
                {
                    param.JsonKind = KintoneJsonKind.ProcessKanri;
                    ProcessDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("プロセス管理");
                }

                //一覧設定
                try
                {
                    param.JsonKind = KintoneJsonKind.ListViews;
                    ListViewDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("一覧設定");
                }

                //グラフ設定
                try
                {
                    param.JsonKind = KintoneJsonKind.Graph;
                    GraphDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("グラフ設定");
                }

                //フィールドレイアウト
                try
                {
                    param.JsonKind = KintoneJsonKind.PartsLayout;
                    FormLayoutDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("フィールドレイアウト");
                }

                //通知設定
                try
                {
                    param.JsonKind = KintoneJsonKind.AppNotification;
                    AppNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.RecordNotification;
                    RecordNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.ReminderNotification;
                    ReminderNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("通知設定");
                }

                //アクセス権設定
                try
                {
                    param.JsonKind = KintoneJsonKind.AppPermission;
                    RecordNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.RecordPermission;
                    RecordNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                    param.JsonKind = KintoneJsonKind.FieldPermission;
                    ReminderNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("通知設定");
                }

                //アプリアクション
                try
                {
                    param.JsonKind = KintoneJsonKind.AppAction;
                    RecordNotificationDeploy(deployFromTo, ReadBackupJsonStr(baseDirectoryPath, param));
                }
                catch (Exception e)
                {
                    if (e is AggregateException ex)
                    {
                        errorMsgList.Add(ex.InnerException.Message);
                    }
                    else
                    {
                        errorMsgList.Add(e.Message);
                    }
                    errorList.Add("アプリアクション");
                }

                if (errorList.Any())
                {
                    Console.WriteLine("\r\n以下の復元に失敗しました。バックアップフォルダを確認してください。");
                    for (var i = 0; i < errorList.Count; i++)
                    {
                        var error = errorList[i];
                        var errorMsg = errorMsgList[i];
                        Console.WriteLine(error);
                        Console.WriteLine(errorMsg + "\r\n");
                    }
                }
                else
                {
                    Console.WriteLine("バックアップからの復元を正常に完了しました。\r\n");
                    ConsoleUtil.WriteWarn("まだ、アプリに適用されていません。kintoneの「変更を中止」から取り消すこともできます");
                    ConsoleUtil.WriteWarn("1.レコードの復元はされていません。レコードのバックアップファイルはrecord.csvです。");
                }
            }
        }*/

        /*private static string SelectFolder()
        {
            //FolderBrowserDialogクラスのインスタンスを作成
            FolderBrowserDialog fbd = new FolderBrowserDialog();

            //上部に表示する説明テキストを指定する
            fbd.Description = "フォルダを指定してください。";
            //ルートフォルダを指定する
            //デフォルトでDesktop
            fbd.RootFolder = Environment.SpecialFolder.Desktop;
            //最初に選択するフォルダを指定する
            //RootFolder以下にあるフォルダである必要がある
            fbd.SelectedPath = Directory.GetCurrentDirectory();
            //ユーザーが新しいフォルダを作成できるようにする
            //デフォルトでTrue
            fbd.ShowNewFolderButton = true;

            //ダイアログを表示する
            if (fbd.ShowDialog() == DialogResult.OK)
            {
                //選択されたフォルダを表示する
                return fbd.SelectedPath;
            }
            else
            {
                return string.Empty;
            }
        }*/
    }
}
