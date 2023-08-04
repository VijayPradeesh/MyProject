using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace ConnectionStringEncryption
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter the connection string to be Encrypted");
            string key = "dehdiud&_0%==ret443dtdd";
            string input = Console.ReadLine();
            Program pg = new Program();
            string output = pg.Encrypt(input, key);
            Console.WriteLine("Encrypted Connection String: "+ output);
            Console.ReadLine();
        }
        public  string Encrypt(string text, string key)
        {
            var data = Encoding.UTF8.GetBytes(text);

            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(key));
                using (var tripDes = new TripleDESCryptoServiceProvider { Key = keys, Mode = CipherMode.ECB, Padding = PaddingMode.PKCS7 })
                {
                    var transform = tripDes.CreateEncryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Convert.ToBase64String(results, 0, results.Length);
                }
            }
        }
        public  string Decrypt(string cipher, string key)
        {
            var data = Convert.FromBase64String(cipher);
            using (var md5 = new MD5CryptoServiceProvider())
            {
                var keys = md5.ComputeHash(Encoding.UTF8.GetBytes(key));

                using (var tripDes = new TripleDESCryptoServiceProvider()
                {
                    Key = keys,
                    Mode = CipherMode.ECB,
                    Padding = PaddingMode.PKCS7
                })
                {
                    var transform = tripDes.CreateDecryptor();
                    var results = transform.TransformFinalBlock(data, 0, data.Length);
                    return Encoding.UTF8.GetString(results);
                }
            }
        }
    }
}

