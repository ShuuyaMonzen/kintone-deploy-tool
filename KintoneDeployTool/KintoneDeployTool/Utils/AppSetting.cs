using System.Configuration;

namespace KintoneDeployTool.Util
{
    /// <summary>
    /// アプリケーションの設定を参照する為のクラス。
    /// 
    /// </summary>
    public class AppSetting
    {
        /// <summary>
        /// このクラスのインスタンス。
        /// ステートレスなのでオブジェクトの共有ができる。
        /// </summary>
        public static readonly AppSetting Instance = new AppSetting();

        /// <summary>
        /// アプリケーションの設定の要素
        /// </summary>
        /// <param name="key">取得したい要素のキー</param>
        /// <returns>要素の値</returns>
        public virtual string this[string key] => Startup.AppSettings[key];
        
        /// <summary>
        /// AES鍵(半角32文字で設定) 
        /// </summary>
        public virtual string AesKey => this[nameof(AesKey)];

    }
}
