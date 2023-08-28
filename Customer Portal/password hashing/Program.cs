using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Security.Cryptography;

namespace passwordHashing
{
    class Program
    {
        static void Main(string[] args)
        {
            Console.WriteLine("Enter the password to be hashed");
            string key = "dehdiud&_0%==ret443dtdd";
            string input = Console.ReadLine();
            Program pg = new Program();
            string s = pg.Encrypt(input, key);

            Console.WriteLine(s);
            string j = pg.Decrypt(s, key);
            // Console.ReadLine();
            // Console.WriteLine(j);
            Console.ReadLine();
            //Console.WriteLine("Enter the name");
            //string input = Console.ReadLine();
            //int num = 0;
            //foreach(var item in input)
            //{
            //    switch (item)
            //    {
            //        case 'A':
            //        case 'a':
            //        case 'I':
            //        case 'i':
            //        case 'J':
            //        case 'j':
            //        case 'Q':
            //        case 'q':
            //        case 'Y':
            //        case 'y':
            //            num += 1;
            //            break;
            //        case 'B':
            //        case 'b':
            //        case 'K':
            //        case 'k':
            //        case 'R':
            //        case 'r':
            //            num += 2;
            //            break;
            //        case 'C':
            //        case 'c':
            //        case 'G':
            //        case 'g':
            //        case 'L':
            //        case 'l':
            //        case 'S':
            //        case 's':
            //            num += 3;
            //            break;
            //        case 'D':
            //        case 'd':
            //        case 'M':
            //        case 'm':
            //        case 'T':
            //        case 't':
            //            num += 4;
            //            break;
            //        case 'E':
            //        case 'e':
            //        case 'H':
            //        case 'h':
            //        case 'N':
            //        case 'n':
            //        case 'X':
            //        case 'x':
            //            num += 5;
            //            break;
            //        case 'U':
            //        case 'u':
            //        case 'V':
            //        case 'v':
            //        case 'W':
            //        case 'w':
            //            num += 6;
            //            break;
            //        case 'O':
            //        case 'o':
            //        case 'Z':
            //        case 'z':
            //            num += 7;
            //            break;
            //        case 'F':
            //        case 'f':
            //        case 'P':
            //        case 'p':
            //            num += 8;
            //            break;
            //        default:
            //            num += 0;
            //            break;
            //    }


            //}
            //string nu = num.ToString();

            //while(nu.Length >1)
            //{
            //    int number = 0;
            //    foreach (var item in nu)
            //    {
            //        number += Int32.Parse(item.ToString());
            //    }
            //    nu = number.ToString();
            //}
            //Console.WriteLine("Numerology Number " + nu);
            //Console.ReadLine();

        }

        public string HashPassword(string Password)
        {
            MD5 md5 = new MD5CryptoServiceProvider();

            //compute hash from the bytes of text  
            md5.ComputeHash(ASCIIEncoding.ASCII.GetBytes(Password));

            //get hash result after compute it  
            byte[] result = md5.Hash;

            StringBuilder strBuilder = new StringBuilder();
            for (int i = 0; i < result.Length; i++)
            {
                //change it into 2 hexadecimal digits  
                //for each byte  
                strBuilder.Append(result[i].ToString("x2"));
            }

            return strBuilder.ToString();
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

