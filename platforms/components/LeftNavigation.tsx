import { HttpMethod } from '@/types';
import { CategoryData } from '@/types/category';
import { ColorUnion } from '@/types/colorUnion';
import { Dialog } from '@headlessui/react';
import { ChevronDoubleLeftIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import TextInput from './atom/TextInput';
import ColorRadioGroup from './ColorRadioGroup';
import NavigationButton from './NavigationButton';

export default function LeftNavigation() {
  // For UI
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [expand, setExpand] = useState(true);
  const handleExpand = () => setExpand(!expand);
  const [dialogOpen, setDialogOpen] = useState(false);
  // For Data
  const [categoryName, setCategoryName] = useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCategoryName(e.target.value);
  const [categoryColor, setCategoryColor] = useState<ColorUnion>('gray');
  const handleColor = (color: ColorUnion) => setCategoryColor(color);

  useEffect(() => {
    async function fetchCategories() {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const fetchedCategories: CategoryData[] = await res.json();
        setCategories(fetchedCategories);
      }
    }
    fetchCategories();
  }, []);

  const createCategory = async () => {
    const newCategory = {
      id: undefined,
      name: categoryName,
      color: categoryColor,
    };

    const res = await fetch('/api/categories', {
      method: HttpMethod.POST,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newCategory),
    });
    if (res.ok) {
      const createdCategory = await res.json();
      const newCategories = [...categories, createdCategory];
      setDialogOpen(false);
      setCategoryName('');
      setCategoryColor('gray');
      setCategories(newCategories);
    } else {
      console.error(`Error occured: ${JSON.stringify(res)}`);
    }
  };

  return (
    <>
      <div
        className={`flex flex-col justify-between h-full bg-gray-50 ${
          expand ? 'w-80 p-6 items-end' : 'w-16 px-2 py-3 items-center'
        }`}
      >
        <div
          className={`flex flex-col w-full ${
            expand ? 'space-y-6' : 'space-y-3'
          }`}
        >
          <Link href="/tasks">
            <a className="flex items-center p-3 space-x-2 rounded hover:bg-white">
              <span className="text-lg text-gray-900">
                {expand ? 'All Tasks' : 'All'}
              </span>
            </a>
          </Link>
          {!expand && <div className="w-full h-px bg-gray-200"></div>}
          <div className="">
            {expand && (
              <h3 className="px-3 mb-3 font-bold text-gray-500 uppercase">
                Category
              </h3>
            )}
            <ul className="">
              {categories.map((category) => (
                <Link
                  href={`/tasks/category/${category.id}`}
                  passHref
                  key={category.id}
                >
                  <a>
                    <NavigationButton
                      color={category.color}
                      text={category.name}
                      open={expand}
                    ></NavigationButton>
                  </a>
                </Link>
              ))}
              <button
                onClick={() => setDialogOpen(true)}
                className="flex w-full p-3 space-x-2 text-gray-600 hover:bg-white"
              >
                <div>
                  <PlusIcon className="w-6 h-6"></PlusIcon>
                </div>
                {expand && <div className="text-lg">New Category</div>}
              </button>
            </ul>
          </div>
        </div>
        <button
          className={`p-1 text-gray-400 rounded hover:bg-white hover:text-gray-500 ${
            expand ? 'rotate-0' : 'rotate-180'
          }`}
          onClick={handleExpand}
        >
          <ChevronDoubleLeftIcon className="w-6 h-6"></ChevronDoubleLeftIcon>
        </button>
      </div>
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center">
          <Dialog.Panel className="max-w-xl px-12 pt-12 pb-6 mx-auto space-y-12 text-gray-900 bg-white rounded-md">
            <Dialog.Title className="text-2xl font-bold">
              Add New Category
            </Dialog.Title>

            <div className="flex flex-col w-full space-y-6">
              <div className="flex flex-col justify-start space-y-2">
                <label htmlFor="category-name" className="text-sm font-bold">
                  Name
                </label>
                <TextInput
                  id={'category-name'}
                  placeholder={'Category Name'}
                  value={categoryName}
                  onChange={onChange}
                ></TextInput>
              </div>
              <div className="flex flex-col justify-start space-y-2">
                <ColorRadioGroup
                  categoryColor={categoryColor}
                  handleColor={handleColor}
                ></ColorRadioGroup>
              </div>
            </div>
            <div className="flex justify-center space-x-12">
              <button className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700">
                Cancel
              </button>
              <button
                onClick={createCategory}
                className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-gray-900 rounded hover:bg-gray-700"
              >
                Add
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  );
}
