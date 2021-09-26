using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ClothAAPIS.Models;

namespace ClothAAPIS.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductsController : ControllerBase
    {
        private readonly ClothAppContext _context;

        public ProductsController(ClothAppContext context)
        {
            _context = context;
        }

        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Product>>> GetProducts()
        {
            var products = await _context.Products.ToListAsync();
            foreach (var item in products)
            {
                List<int> relatedProducts = new List<int>();
                List<RelatedProductViewModel> lstRelatedProducts = new List<RelatedProductViewModel>();
                RelatedProductViewModel model;
                if (!string.IsNullOrEmpty(item.RelatedProductIds))
                {
                    relatedProducts = item.RelatedProductIds.Split(',').Select(x => int.Parse(x)).ToList();
                }

                var relProducts = products.Where(s => relatedProducts.Contains(s.Id)).ToList();
                
                foreach (var rel in relProducts)
                {
                    model = new RelatedProductViewModel();
                    model.Name = string.Format("{0} | {1}", rel.Id, rel.ProductName);
                    model.ProductId = rel.Id;
                    lstRelatedProducts.Add(model);
                }
                item.RelatedProductsSelected = lstRelatedProducts;
                
            }
            return products;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
            {
                return NotFound();
            }
            List<int> relatedProducts = new List<int>();
            List<RelatedProductViewModel> lstRelatedProducts = new List<RelatedProductViewModel>();
            List<RelatedProducts> lstProducts = new List<RelatedProducts>();
            RelatedProductViewModel model;
            if (!string.IsNullOrEmpty(product.RelatedProductIds))
            {
                relatedProducts = product.RelatedProductIds.Split(',').Select(x => int.Parse(x)).ToList();
            }

            var relProducts = _context.Products.Where(s => relatedProducts.Contains(s.Id)).ToList();
            foreach (var rel in relProducts)
            {
                model = new RelatedProductViewModel();
                model.Name = string.Format("{0} | {1}", rel.Id, rel.ProductName);
                model.ProductId = rel.Id;
                lstRelatedProducts.Add(model);
                lstProducts.Add(new RelatedProducts() { Id = rel.Id, ProductName = rel.ProductName });
            }
            product.RelatedProducts = lstProducts;
            product.RelatedProductsSelected = lstRelatedProducts;
            return product;
        }

        
        [HttpPut("{id}")]
        public async Task<IActionResult> PutProduct(int id, Product product)
        {
            if (id != product.Id)
            {
                return BadRequest();
            }

            var oldProduct = await _context.Products.Where(s => s.Id == id).FirstOrDefaultAsync();
            if (oldProduct != null)
            {
                string relatedIds = "";
                if (product.RelatedProducts.Count > 0)
                {
                    relatedIds = string.Join(",", product.RelatedProducts.Select(s => s.Id));
                }
                oldProduct.Base = product.Base;
                oldProduct.Description = product.Description;
                oldProduct.Price = product.Price;
                oldProduct.ProductName = product.ProductName;
                oldProduct.RelatedProductIds = relatedIds;
                
            }

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ProductExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        
        [HttpPost]
        public async Task<ActionResult<Product>> PostProduct(Product product)
        {
            if (product.RelatedProducts.Count > 0)
            {
                product.RelatedProductIds = string.Join(",", product.RelatedProducts.Select(s => s.Id));
            }
            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetProduct", new { id = product.Id }, product);
        }

        [HttpDelete("{id}")]
        public async Task<ActionResult<Product>> DeleteProduct(int id)
        {
            var product = await _context.Products.FindAsync(id);
            if (product == null)
            {
                return NotFound();
            }

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            return product;
        }

        private bool ProductExists(int id)
        {
            return _context.Products.Any(e => e.Id == id);
        }
    }
}
