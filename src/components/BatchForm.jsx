function BatchForm({ formData, setFormData, onSubmit }) {
  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));
  }

  return (
    <form className="card form-card" onSubmit={onSubmit}>
      <div className="section-heading">
        <span className="step-number">1</span>
        <div>
          <h2>Batch information</h2>
          <p>Enter only the basic details about this batch.</p>
        </div>
      </div>

      <div className="form-grid">
        <label>
          Product
          <select
            name="product"
            value={formData.product}
            onChange={handleChange}
          >
            <option>Dried Apricots</option>
            <option>Walnuts</option>
            <option>Almonds</option>
            <option>Pine Nuts</option>
          </select>
        </label>

        <label>
          Village
          <input
            name="village"
            value={formData.village}
            onChange={handleChange}
            placeholder="e.g. Bumburet"
            required
          />
        </label>

        <label>
          Quantity
          <div className="input-with-unit">
            <input
              name="quantity"
              type="number"
              min="1"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="20"
              required
            />
            <span>kg</span>
          </div>
        </label>

        <label>
          Drying method
          <select
            name="dryingMethod"
            value={formData.dryingMethod}
            onChange={handleChange}
          >
            <option>Raised Rack</option>
            <option>Open Air</option>
            <option>Solar Dryer</option>
          </select>
        </label>

        <label>
          Date dried
          <input
            name="dateDried"
            type="date"
            value={formData.dateDried}
            onChange={handleChange}
            required
          />
        </label>
      </div>

      <button className="primary-button full-button" type="submit">
        Continue to Photos →
      </button>
    </form>
  );
}

export default BatchForm;