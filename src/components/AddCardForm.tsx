import type { ChangeEvent, FC, FormEvent } from 'react';
import type { Card } from '../type/card';
import { useRef, useState } from 'react';
import noImage from '../assets/no-image.jpg';
import './AddCardForm.css';

interface AddCardFormProps {
  addCard: (newCard: Card) => void;
}

const initState = {
  title: '',
  img: null as File | null,
};

const AddCardForm: FC<AddCardFormProps> = ({ addCard }) => {
  const [newCard, setNewCard] = useState<{ title: string; img: File | null }>(initState);
  const [error, setError] = useState('');
  const [imgPreview, setImgPreview] = useState<string | undefined>();

  const inputImgRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    setNewCard({
      ...newCard,
      [name]: value,
    });
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    const file = e.target.files[0];

    if (file.size > 3 * 1024 * 1024) {
      setError('Размер файла не более 3 Mb!');
      return;
    }

    if (file.type !== 'image/png' && file.type !== 'image/jpeg' && file.type !== 'image/jpg') {
      setError('Разрешены только PNG и JPG файлы!');
      return;
    }

    setError('');
    setNewCard({
      ...newCard,
      img: file,
    });
    setImgPreview(URL.createObjectURL(file));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { title, img } = newCard;

    if (title) {
      addCard({
        title,
        img: img ? URL.createObjectURL(img) : noImage,
        id: Date.now(),
      });
      setNewCard(initState);
      setImgPreview(undefined);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="title"
        type="text"
        placeholder="Название"
        onChange={handleChange}
        value={newCard.title}
        required
      />
      <div className="img">
        {imgPreview && <img className="img_preview" src={imgPreview} alt="preview" />}
        <label className="add-img_button">
          {imgPreview ? 'Изменить картинку' : 'Загрузить картинку'}
          <input type="file" accept="image/*" ref={inputImgRef} onChange={handleImgChange} />
        </label>
        <span className="img_desc">До 3MB</span>
      </div>
      {error && <div className="error_desc">{error}</div>}
      <button className="add-card_button" type="submit">
        {' '}
        Добавить карточку
      </button>
    </form>
  );
};

export default AddCardForm;
