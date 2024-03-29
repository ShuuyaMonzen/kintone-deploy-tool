﻿using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;

namespace KintoneDeployTool.Extentions
{
    public static class SessionExtensions
    {
        // セッションにオブジェクトを書き込む
        public static void SetObject<TObject>(this ISession session, string key, TObject obj)
        {
            var json = JsonConvert.SerializeObject(obj);
            session.SetString(key, json);
        }

        // セッションからオブジェクトを読み込む
        public static TObject GetObject<TObject>(this ISession session, string key)
        {
            var json = session.GetString(key);
            return string.IsNullOrEmpty(json)
                ? default
                : JsonConvert.DeserializeObject<TObject>(json);
        }
    }
}
