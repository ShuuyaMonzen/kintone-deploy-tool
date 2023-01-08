using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KintoneDeployTool.Utils.Time
{
    /// <summary>
    /// 日時関連のオブジェクトを取得するクラス。
    ///
    /// 単体テストの際は、このクラスのオブジェクトを入れ替えれば、任意の日時を
    /// 現在日時としてクライアントコードに渡すことが出来る。
    /// 
    /// 参考 : http://bliki-ja.github.io/ClockWrapper/
    /// </summary>
    public class Clock
    {
        /// <summary>
        /// このクラスのインスタンス。
        /// ステートレスなのでオブジェクトの共有ができる。
        /// </summary>
        public static readonly Clock Instance = new Clock();

        /// <summary>
        /// 現在の日時。<see cref="DateTime.Now"/>のラッパー。
        /// </summary>
        public virtual DateTime Now
        {
            get { return DateTime.Now; }
        }

        /// <summary>
        /// 現在の日時。<see cref="DateTime.Today"/>のラッパー。
        /// </summary>
        public virtual DateTime Today
        {
            get { return DateTime.Today; }
        }
    }
}
