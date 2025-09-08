import type { ChangeEvent, FC, FormEvent } from 'react';
import type { Card } from '../type/card';
import { useRef, useState } from 'react';
import noImage from '../assets/no-image.jpg';

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
    <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
      <input
        name="title"
        type="text"
        placeholder="Название"
        onChange={handleChange}
        value={newCard.title}
        required
        className="w-full p-4 text-base border-2 border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 font-inter focus:outline-none focus:border-[#667eea] focus:bg-white focus:shadow-[0_0_0_3px_rgba(102,126,234,0.1)] focus:-translate-y-0.5"
      />

      <div className="flex flex-col items-center gap-3 p-5 border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 transition-all duration-300 hover:border-[#667eea] hover:bg-blue-50">
        {imgPreview && (
          <img
            className="w-20 h-30 object-cover rounded-md shadow-md border-3 border-white"
            src={imgPreview}
            alt="preview"
          />
        )}
        <label className="px-7 py-3.5 bg-gradient-to-br from-[#667eea] to-[#764ba2] text-white border-none rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 inline-flex items-center gap-2 shadow-sm shadow-blue-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-blue-400 active:translate-y-0">
          {imgPreview ? 'Изменить картинку' : 'Загрузить картинку'}
          <input
            type="file"
            accept="image/*"
            ref={inputImgRef}
            onChange={handleImgChange}
            className="hidden"
          />
        </label>
        <span className="text-gray-500 text-xs font-medium">До 3MB</span>
      </div>

      {error && (
        <div className="text-red-600 text-center text-sm font-medium py-3 bg-red-100 rounded-md border border-red-300">
          {error}
        </div>
      )}

      <button
        className="px-8 py-4 bg-gradient-to-br from-[#48bb78] to-[#38a169] text-white border-none rounded-lg text-base font-semibold cursor-pointer transition-all duration-300 mt-2.5 shadow-sm shadow-green-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-green-400 active:translate-y-0 uppercase tracking-wide"
        type="submit"
      >
        Добавить карточку
      </button>
    </form>
  );
};

export default AddCardForm;
