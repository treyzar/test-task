import React from "react";
import { getLabels } from "../../entities/label/label.api";
import { LabelCard } from "./LabelCard";
import { CreateLabelForm } from "../../features/create-label/CreateLabelForm";
import type { Label } from "../../entities/label/label.types";
import { Modal } from "../../shared/ui/Modal";
import { Button } from "../../shared/ui/Button";
import "./LabelsPage.scss";

export const LabelsPage: React.FC = () => {
  const [labels, setLabels] = React.useState<Label[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [filterColor, setFilterColor] = React.useState("");

  React.useEffect(() => {
    const load = async () => {
      const data = await getLabels();
      setLabels(data);
      setLoading(false);
    };
    load();
  }, []);

  const applyFilters = React.useCallback(() => {
    let filtered = [...labels];

    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((label) =>
        label.caption.toLowerCase().includes(term)
      );
    }

    if (filterColor) {
      filtered = filtered.filter(
        (label) => label.color.toLowerCase() === filterColor.toLowerCase()
      );
    }

    return filtered;
  }, [labels, searchTerm, filterColor]);

  const handleCreate = async () => {
    const data = await getLabels();
    setLabels(data);
    setIsModalOpen(false);
  };

  return (
    <div className="labels-page">
      <h2>Метки</h2>

      <div className="labels-controls">
        <input
          placeholder="Поиск по названию"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="form-input search-input"
        />

        <select
          value={filterColor}
          onChange={(e) => setFilterColor(e.target.value)}
          className="form-select color-filter"
        >
          <option value="">Все цвета</option>
          {Array.from(new Set(labels.map((label) => label.color))).map(
            (color) => (
              <option key={color} value={color}>
                {color}
              </option>
            )
          )}
        </select>

        <Button onClick={() => setIsModalOpen(true)}>+ Новая метка</Button>
      </div>

      <div className="labels-grid">
        {loading ? (
          <p>Загрузка...</p>
        ) : applyFilters().length > 0 ? (
          applyFilters().map((label) => (
            <LabelCard key={label.id} label={label} onDeleted={handleCreate} />
          ))
        ) : (
          <p>Нет меток по заданным критериям</p>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <h3>Создать метку</h3>
        <CreateLabelForm onCreate={handleCreate} />
      </Modal>
    </div>
  );
};
