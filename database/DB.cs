using System;
using System.Data.SqlClient;

class Program
{
    static void Main()
    {
        string connectionString =
        "Server=INDI_NICOLE\SQLEXPRESS;Database=InventarioDB;Trusted_Connection=True;TrustServerCertificate=True;";

        using (SqlConnection connection = new SqlConnection(connectionString))
        {
            try
            {
                connection.Open();
                Console.WriteLine("Conexión exitosa ");

                string query = "SELECT * FROM Usuarios";

                SqlCommand command = new SqlCommand(query, connection);
                SqlDataReader reader = command.ExecuteReader();

                while (reader.Read())
                {
                    Console.WriteLine(reader["Nombre"].ToString());
                }

                reader.Close();
            }
            catch (Exception ex)
            {
                Console.WriteLine("Error: " + ex.Message);
            }
        }
    }
}
