using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KintoneDeployTool.DataAccess.Const
{
    public static class CodeConst
    {
        public static int ADD_TARGET_ID_VALUE { get; } = -1;

        #region 列挙型
        public enum SiteKindEnum
        {
            DeployFrom,
            DeployTo
        }

        public enum KintoneJsonKind
        {
            #region 運用環境
            /// <summary>
            /// アプリ情報Json
            /// </summary>
            Apps,
            /// <summary>
            /// スペース情報Json
            /// </summary>
            Space,
            /// <summary>
            /// 一般設定Json
            /// </summary>
            Setting,
            /// <summary>
            /// プロセス管理Json
            /// </summary>
            ProcessKanri,
            /// <summary>
            /// フォーム部品情報Json
            /// </summary>
            PartsList,
            /// <summary>
            /// フォーム部品レイアウトJson
            /// </summary>
            PartsLayout,
            /// <summary>
            /// 一覧情報Json
            /// </summary>
            ListViews,
            /// <summary>
            /// 運用環境デプロイJson
            /// </summary>
            Deploy,
            /// <summary>
            /// 運用環境カスタマイズJson
            /// </summary>
            CustomizeFile,
            /// <summary>
            /// 運用環境ファイルダウンロードJson
            /// </summary>
            FileDownload,
            /// <summary>
            /// 運用環境ファイルアップロードJson
            /// </summary>
            FileUpload,
            /// <summary>
            /// 運用環境アプリのグラフ設定
            /// </summary>
            Graph,
            /// <summary>
            /// 運用環境アプリの条件通知
            /// </summary>
            AppNotification,
            /// <summary>
            /// 運用環境レコードの条件通知
            /// </summary>
            RecordNotification,
            /// <summary>
            /// 運用環境リマインダーの条件通知
            /// </summary>
            ReminderNotification,
            /// <summary>
            /// 運用環境アプリのアクセス権
            /// </summary>
            AppPermission,
            /// <summary>
            /// 運用環境レコードのアクセス権
            /// </summary>
            RecordPermission,
            /// <summary>
            /// 運用環境フィールドのアクセス権
            /// </summary>
            FieldPermission,
            /// <summary>
            /// 運用環境アプリのアクション設定
            /// </summary>
            AppAction,
            #endregion

            #region プレビュー
            /// <summary>
            /// 一般設定Json
            /// </summary>
            SettingPreview,
            /// <summary>
            /// プロセス管理Json
            /// </summary>
            ProcessKanriPreview,
            /// <summary>
            /// フォーム部品情報Json
            /// </summary>
            PartsListPreview,
            /// <summary>
            /// フォーム部品レイアウトJson
            /// </summary>
            PartsLayoutPreview,
            /// <summary>
            /// 一覧情報Json
            /// </summary>
            ListViewsPreview,
            /// <summary>
            /// カスタマイズJson
            /// </summary>
            CustomizeFilePreview,
            /// <summary>
            /// アプリのグラフ設定
            /// </summary>
            GraphPreview,
            /// <summary>
            /// アプリの条件通知
            /// </summary>
            AppNotificationPreview,
            /// <summary>
            /// レコードの条件通知
            /// </summary>
            RecordNotificationPreview,
            /// <summary>
            /// リマインダーの条件通知
            /// </summary>
            ReminderNotificationPreview,
            /// <summary>
            /// アプリのアクセス権
            /// </summary>
            AppPermissionPreview,
            /// <summary>
            /// レコードのアクセス権
            /// </summary>
            RecordPermissionPreview,
            /// <summary>
            /// フィールドのアクセス権
            /// </summary>
            FieldPermissionPreview,
            /// <summary>
            /// アプリのアクション設定
            /// </summary>
            AppActionPreview,
            /// <summary>
            /// 運用環境への反映状況確認
            /// </summary>
            DeployPreview,
            #endregion

            #region レコード
            /// <summary>
            /// レコードのAPI
            /// </summary>
            Records
            #endregion
        }
        #endregion

    }
}
