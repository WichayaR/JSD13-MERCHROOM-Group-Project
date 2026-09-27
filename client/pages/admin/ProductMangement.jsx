import { useEffect, useState } from 'react';
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../src/api/products.api';
import { getProductOptions } from '../../src/api/dashboard.api';
import AdminPanel from '../../src/components/admin/AdminPanel';
import AdminTable from '../../src/components/admin/AdminTable';

const GENRE_OPTIONS = [
  { id: 'apparel', label: 'Apparel' },
  { id: 'bags', label: 'Bags' },
  { id: 'collectibles', label: 'Collectibles' },
  { id: 'home', label: 'Home & Lifestyle' },
  { id: 'accessories', label: 'Accessories' },
  { id: 'posters', label: 'Posters' },
  { id: 'handicraft', label: 'Handicraft' },
];
const genreTag = (id) => `genre:${id}`;
const getGenreId = (tags) => normalizeTags(tags).find((tag) => tag.startsWith('genre:'))?.slice('genre:'.length) || '';
const isStoredProductImage = (value) => /^\/api\/products\/[a-f\d]{24}\/image$/i.test(value || '');
const blank = { name: '', description: '', price: '', quantity: '', category: '', artist: '', imageUrl: '', imageUrls: [], imageBytes: [], imageFit: 'cover', tags: [] };
const normalizeTags = (tags) => [...new Set((Array.isArray(tags) ? tags : String(tags || '').split(',')).map((tag) => String(tag).trim().toLowerCase()).filter(Boolean))];
const emptyOptions = { categories: [], artists: [] };
const productCacheKey = 'merchroom-admin-products-db-cache-v1';
const isDatabaseProduct = (product) => /^[a-f\d]{24}$/i.test(String(product?._id || ''));
const getCachedProducts = () => {
  try {
    const products = JSON.parse(localStorage.getItem(productCacheKey));
    return Array.isArray(products) ? products.filter(isDatabaseProduct) : [];
  } catch {
    return [];
  }
};
const cacheProducts = (products) => {
  try {
    localStorage.setItem(productCacheKey, JSON.stringify(products.filter(isDatabaseProduct)));
  } catch {
    // The current screen can still use the live response if storage is unavailable.
  }
};

export default function ProductManagement() {
  const [products, setProducts] = useState(getCachedProducts);
  const [options, setOptions] = useState(emptyOptions);
  const [form, setForm] = useState(null);
  const [tagInput, setTagInput] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);
  const load = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const databaseProducts = Array.isArray(data?.products) ? data.products.filter(isDatabaseProduct) : [];
      setProducts(databaseProducts);
      cacheProducts(databaseProducts);
      setError('');
    } catch (err) {
      setProducts(getCachedProducts());
      setError(err?.message || 'Unable to refresh products from database');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    getProductOptions()
      .then((opts) => {
        if (opts && Array.isArray(opts.categories) && Array.isArray(opts.artists)) {
          setOptions(opts);
        }
      })
      .catch((err) => {
        setOptions(emptyOptions);
        setError(err?.message || 'Unable to load product options from database');
      });
  }, []);

  const save = async (event) => {
    event.preventDefault();
    if (saving) return;
    setError('');
    setSaving(true);
    try {
      const body = {
        name: form.name,
        description: form.description,
        price: Number(form.price),
        quantity: Number(form.quantity),
        imageUrl: form.imageUrls?.[0] || form.imageUrl,
        imageUrls: form.imageUrls || (form.imageUrl ? [form.imageUrl] : []),
        imageFit: form.imageFit || 'cover',
        category: form.category || undefined,
        artist: form.artist || undefined,
        tags: [...normalizeTags(form.tags).filter((tag) => !tag.startsWith('genre:')), ...(form.genre ? [genreTag(form.genre)] : [])],
      };
      if (form._id) {
        await updateProduct(form._id, body);
      } else {
        await createProduct(body);
      }
      await load();
      setForm(null);
    } catch (err) {
      setError(err?.message || 'Failed to save product to database');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      load();
    } catch (err) {
      setError(err?.message || 'Failed to delete product from database');
    }
  };

  const edit = (item) =>
    setForm({
      ...item,
      category: item.category?._id || item.category || '',
      artist: item.artist?._id || item.artist || '',
      imageUrls: isStoredProductImage(item.imageUrl) ? [] : (item.imageUrls?.length ? item.imageUrls : (item.imageUrl ? [item.imageUrl] : [])),
      imageBytes: [],
      imageFit: item.imageFit || 'cover',
      tags: normalizeTags(item.tags),
      genre: getGenreId(item.tags),
    });

  const addTag = () => {
    const tags = normalizeTags([...normalizeTags(form?.tags), tagInput]);
    if (tagInput.trim()) setForm((current) => ({ ...current, tags }));
    setTagInput('');
  };

  const removeTag = (tag) => setForm((current) => ({ ...current, tags: (current.tags || []).filter((item) => item !== tag) }));

  const addImages = (event) => {
    const files = Array.from(event.target.files || []).filter((file) => file.type.startsWith('image/'));
    if (!files.length) return;
    if ((form.imageUrls?.length || 0) + files.length > 5) {
      setError('You can upload up to 5 images per product.');
      event.target.value = '';
      return;
    }
    if (files.some((file) => file.size > 2 * 1024 * 1024)) {
      setError('Each image must be 2 MB or smaller.');
      event.target.value = '';
      return;
    }
    if ((form.imageBytes || []).reduce((sum, bytes) => sum + bytes, 0) + files.reduce((sum, file) => sum + file.size, 0) > 10 * 1024 * 1024) {
      setError('The total size of uploaded images must be 10 MB or smaller.');
      event.target.value = '';
      return;
    }
    Promise.all(files.map((file) => new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    }))).then((images) => {
      setForm((current) => ({ ...current, imageUrls: [...(current.imageUrls || []), ...images], imageBytes: [...(current.imageBytes || []), ...files.map((file) => file.size)] }));
      event.target.value = '';
    }).catch(() => setError('Unable to read one or more image files.'));
  };

  const safeProducts = Array.isArray(products) ? products : [];
  const safeCategories = Array.isArray(options?.categories) ? options.categories : [];
  const safeArtists = Array.isArray(options?.artists) ? options.artists : [];

  const resolveCategoryName = (category) => {
    if (!category) return '—';
    if (typeof category === 'object' && category.name) return category.name;
    const found = safeCategories.find((c) => String(c._id) === String(category));
    return found ? found.name : String(category);
  };

  const resolveArtistName = (artist) => {
    if (!artist) return '—';
    if (typeof artist === 'object' && artist.name) return artist.name;
    const found = safeArtists.find((a) => String(a._id) === String(artist));
    return found ? found.name : String(artist);
  };

  return (
    <div className="admin-page">
      <AdminPanel
        title="Product Management"
        action={
          <button className="primary-btn" onClick={() => { setError(''); setForm(blank); setTagInput(''); }}>
            Add product
          </button>
        }
      >
        {error && <p className="form-error">{error}</p>}
        {loading && <p className="form-error" style={{ color: '#5b52c8' }}>Refreshing products from database…</p>}
        <AdminTable columns={['Product', 'Artist', 'Category', 'Tags', 'Price', 'Stock', '']}>
          {safeProducts.map((item) => (
            <tr key={item._id || item.id}>
              <td>{item.name}</td>
              <td>{resolveArtistName(item.artist)}</td>
              <td>{resolveCategoryName(item.category)}</td>
              <td>{normalizeTags(item.tags).join(', ') || '—'}</td>
              <td>฿{Number(item.price || 0).toLocaleString()}</td>
              <td>{item.quantity ?? 0}</td>
              <td>
                <button className="link-btn" onClick={() => { edit(item); setTagInput(''); }}>
                  Edit
                </button>
                <button
                  className="link-btn danger"
                  onClick={() => remove(item._id || item.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </AdminTable>
      </AdminPanel>

      {form && (
        <div className="modal">
          <form className="product-form" onSubmit={save}>
            <button type="button" className="close" onClick={() => setForm(null)}>
              ×
            </button>
            <h2>{form._id ? 'Edit product' : 'Add product'}</h2>
            {error && <p className="form-error" role="alert">{error}</p>}
            <input
              required
              placeholder="Name"
              value={form.name || ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description || ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Price"
              value={form.price ?? ''}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
            />
            <input
              required
              type="number"
              min="0"
              placeholder="Quantity"
              value={form.quantity ?? ''}
              onChange={(e) => setForm({ ...form, quantity: e.target.value })}
            />
            <select
              required
              value={form.category || ''}
              onChange={(e) => setForm({ ...form, category: e.target.value })}
            >
              <option value="">Category</option>
              {safeCategories.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <select value={form.artist || ''} onChange={(e) => setForm({ ...form, artist: e.target.value })}>
              <option value="">No artist</option>
              {safeArtists.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.name}
                </option>
              ))}
            </select>
            <input
              placeholder="Image URL"
              value={form.imageUrl || ''}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
            />
            <label className="image-upload">
              <span>Upload product images</span>
              <input type="file" accept="image/*" multiple onChange={addImages} />
              <small>Select up to 5 images from this computer (up to 2 MB each; 10 MB total).</small>
            </label>
            <select value={form.imageFit || 'cover'} onChange={(e) => setForm({ ...form, imageFit: e.target.value })}>
              <option value="cover">Image fit: Cover (fill and crop)</option>
              <option value="contain">Image fit: Contain (show full image)</option>
              <option value="fill">Image fit: Fill (stretch)</option>
              <option value="scale-down">Image fit: Scale down</option>
            </select>
            <select value={form.genre || ''} onChange={(e) => setForm({ ...form, genre: e.target.value })}>
              <option value="">Genre (not assigned)</option>
              {GENRE_OPTIONS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
            {(form.imageUrls?.length > 0 || form.imageUrl) && (
              <div className="image-previews" aria-label="Selected product images">
                {(form.imageUrls?.length ? form.imageUrls : [form.imageUrl]).map((image, index) => (
                  <figure key={`${index}-${image.slice(0, 30)}`}>
                    <img src={image} alt={`Product preview ${index + 1}`} />
                    <button
                      type="button"
                      aria-label={`Remove image ${index + 1}`}
                      onClick={() => setForm((current) => ({ ...current, imageUrls: (current.imageUrls || [current.imageUrl]).filter((_, imageIndex) => imageIndex !== index), imageBytes: (current.imageBytes || []).filter((_, imageIndex) => imageIndex !== index) }))}
                    >
                      ×
                    </button>
                  </figure>
                ))}
              </div>
            )}
            <div className="col-span-full rounded-[10px] border border-[#ddd7ce] p-3">
              <label className="block text-sm font-semibold text-[#3d3a35]">Tags</label>
              <p className="mt-1 text-xs text-[#777]">Genre is selected above and used by Browse By Genre. Other tags can still be added here.</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {normalizeTags(form.tags).map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#e6e3ff] px-2.5 py-1 text-xs font-semibold text-[#3f35a0]">
                    {tag}
                    <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove tag ${tag}`} className="ml-0.5 leading-none">×</button>
                  </span>
                ))}
                {!normalizeTags(form.tags).length && <span className="text-xs text-[#777]">No tags added</span>}
              </div>
              <div className="mt-3 flex gap-2">
                <input
                  value={tagInput}
                  placeholder="Add a tag"
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addTag(); } }}
                />
                <button type="button" className="link-btn shrink-0" onClick={addTag}>Add tag</button>
              </div>
            </div>
            <button className="primary-btn" disabled={saving}>{saving ? 'Saving product…' : 'Save product'}</button>
          </form>
        </div>
      )}
    </div>
  );
}
