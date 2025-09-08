import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from '../src/App';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock URL.createObjectURL
const createObjectURLMock = vi.fn();
Object.defineProperty(window, 'URL', {
  value: {
    createObjectURL: createObjectURLMock,
  },
  writable: true,
});

// Mock файла для тестирования загрузки изображения
const createTestFile = (name: string, type: string, size: number): File => {
  const file = new File([], name, { type });
  Object.defineProperty(file, 'size', { value: size });
  return file;
};

// Mock для no-image.jpg
vi.mock('../src/assets/no-image.jpg', () => ({
  default: 'mocked-no-image.jpg',
}));

describe('App Logic Tests', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    localStorageMock.clear();
    createObjectURLMock.mockReset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  it('должен добавлять карточку без изображения', async () => {
    render(<App />);
    
    // Вводим название карточки
    const titleInput = screen.getByPlaceholderText('Название');
    await user.type(titleInput, 'Тестовая карточка');
    
    // Нажимаем кнопку добавления
    const addButton = screen.getByText('Добавить карточку');
    await user.click(addButton);
    
    // Проверяем, что карточка появилась
    await waitFor(() => {
      expect(screen.getByText('Тестовая карточка')).toBeInTheDocument();
    });
  });

  it('должен добавлять карточку с изображением', async () => {
    const testFile = createTestFile('test.jpg', 'image/jpeg', 1024 * 1024);
    createObjectURLMock.mockReturnValue('blob:test-image-url');
    
    render(<App />);
    
    // Вводим название карточки
    const titleInput = screen.getByPlaceholderText('Название');
    await user.type(titleInput, 'Карточка с изображением');
    
    // Загружаем изображение
    const fileInput = screen.getByLabelText('Загрузить картинку');
    await user.upload(fileInput, testFile);
    
    // Нажимаем кнопку добавления
    const addButton = screen.getByText('Добавить карточку');
    await user.click(addButton);
    
    // Проверяем, что карточка появилась
    await waitFor(() => {
      expect(screen.getByText('Карточка с изображением')).toBeInTheDocument();
    });
    
    expect(createObjectURLMock).toHaveBeenCalledWith(testFile);
  });

  it('должен показывать ошибку при загрузке слишком большого файла', async () => {
    const largeFile = createTestFile('large.jpg', 'image/jpeg', 4 * 1024 * 1024);
    
    render(<App />);
    
    // Загружаем слишком большое изображение
    const fileInput = screen.getByLabelText('Загрузить картинку');
    await user.upload(fileInput, largeFile);
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Размер файла не более 3 Mb!')).toBeInTheDocument();
    });
  });

  it('должен показывать ошибку при загрузке неподдерживаемого формата', async () => {
    const invalidFile = createTestFile('test.gif', 'image/gif', 1024 * 1024);
    
    render(<App />);
    
    // Загружаем неподдерживаемый формат
    const fileInput = screen.getByLabelText('Загрузить картинку');
    await user.upload(fileInput, invalidFile);
    
    // Проверяем, что появилось сообщение об ошибке
    await waitFor(() => {
      expect(screen.getByText('Разрешены только PNG и JPG файлы!')).toBeInTheDocument();
    });
  });

  it('должен удалять карточку', async () => {
    // Предварительно добавляем карточку
    localStorageMock.setItem('cards', JSON.stringify([
      {
        id: 1,
        title: 'Карточка для удаления',
        img: 'test-image.jpg'
      }
    ]));
    
    render(<App />);
    
    // Проверяем, что карточка отображается
    await waitFor(() => {
      expect(screen.getByText('Карточка для удаления')).toBeInTheDocument();
    });
    
    // Нажимаем кнопку удаления
    const deleteButton = screen.getByText('Удалить');
    await user.click(deleteButton);
    
    // Проверяем, что карточка удалилась
    await waitFor(() => {
      expect(screen.queryByText('Карточка для удаления')).not.toBeInTheDocument();
    });
  });

  it('должен сохранять карточки в localStorage', async () => {
    render(<App />);
    
    // Добавляем карточку
    const titleInput = screen.getByPlaceholderText('Название');
    await user.type(titleInput, 'Тест сохранения');
    
    const addButton = screen.getByText('Добавить карточку');
    await user.click(addButton);
    
    // Проверяем, что данные сохранились в localStorage
    await waitFor(() => {
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'cards',
        expect.stringContaining('Тест сохранения')
      );
    });
  });

  it('должен загружать карточки из localStorage при монтировании', async () => {
    // Настраиваем мок localStorage с предварительными данными
    const mockCards = [
      {
        id: 123,
        title: 'Предварительная карточка',
        img: 'test-image.jpg'
      }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockCards));
    
    render(<App />);
    
    // Проверяем, что карточка загрузилась из localStorage
    await waitFor(() => {
      expect(screen.getByText('Предварительная карточка')).toBeInTheDocument();
    });
    
    expect(localStorageMock.getItem).toHaveBeenCalledWith('cards');
  });
});