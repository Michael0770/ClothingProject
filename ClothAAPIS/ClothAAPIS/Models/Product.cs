using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace ClothAAPIS.Models
{
    public class Product
    {
        [Key]
        public int Id { get; set; }
        [Column(TypeName = "nvarchar(250)")]
        public string ProductName { get; set; }
        [Column(TypeName = "nvarchar(500)")]
        public string Description { get; set; }
        [Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }
        [Column(TypeName = "nvarchar(150)")]
        public string Base { get; set; }
        public string RelatedProductIds { get; set; }
        [NotMapped]
        public List<RelatedProducts> RelatedProducts { get; set; }
        [NotMapped]
        public List<RelatedProductViewModel> RelatedProductsSelected { get; set; }
    }

    public class RelatedProducts
    {
        public int Id { get; set; }
        public string ProductName { get; set; }
    }

    public class RelatedProductViewModel
    {
        public int ProductId { get; set; }
        public string Name { get; set; }
    }
}
