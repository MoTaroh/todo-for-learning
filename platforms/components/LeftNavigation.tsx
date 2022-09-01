import { HttpMethod } from '@/types';
import { CategoryData } from '@/types/category';
import { ColorUnion } from '@/types/colorUnion';
import { Dialog, Menu, Transition } from '@headlessui/react';
import {
  ChevronDoubleLeftIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment, useEffect, useState } from 'react';
import Circle from './atom/Circle';
import TextInput from './atom/TextInput';
import ColorRadioGroup from './ColorRadioGroup';

const MODAL_ACTION = {
  ADD_CATEGORY: 'ADD_CATEGORY',
  EDIT_CATEGORY: 'EDIT_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
};

export default function LeftNavigation() {
  // For UI
  const [categories, setCategories] = useState<CategoryData[]>([]);
  const [categoryToChange, setCategoryToChange] = useState<CategoryData | null>(
    null
  );
  const [expand, setExpand] = useState(true);
  const handleExpand = () => setExpand(!expand);
  const [showModal, toggleShowModal] = useState(false);
  const [modalAction, changeModalAction] = useState<string | null>(null);
  // For Data
  const [categoryName, setCategoryName] = useState<string>('');
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setCategoryName(e.target.value);
  const [categoryColor, setCategoryColor] = useState<ColorUnion>('gray');
  const handleColor = (color: ColorUnion) => setCategoryColor(color);
  const setTargetCategory = (category: CategoryData) => {
    setCategoryToChange(category);
    setCategoryName(category.name);
    setCategoryColor(category.color);
  };
  const resetStates = () => {
    setCategoryToChange(null);
    setCategoryName('');
    setCategoryColor('gray');
  };

  async function fetchCategories() {
    const res = await fetch('/api/categories');
    if (res.ok) {
      const fetchedCategories: CategoryData[] = await res.json();
      setCategories(fetchedCategories);
    } else {
      console.error(res);
    }
  }

  useEffect(() => {
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
      toggleShowModal(false);
      resetStates();
      setCategories(newCategories);
    } else {
      console.error(`Error occured: ${JSON.stringify(res)}`);
    }
  };
  const editCategory = async () => {
    if (!categoryToChange) return;
    const toUpdate = {
      id: categoryToChange.id,
      name: categoryName,
      color: categoryColor,
    };
    const res = await fetch(`/api/categories/${toUpdate.id}`, {
      method: HttpMethod.PUT,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(toUpdate),
    });
    if (res.ok) {
      const newCategories = categories.map((category) => {
        if (category.id === toUpdate.id) {
          return toUpdate;
        }
        return category;
      });
      toggleShowModal(false);
      resetStates();
      setCategories(newCategories);
    } else {
      console.error(`Error occured: ${JSON.stringify(res)}`);
    }
  };
  const deleteCategory = async () => {
    if (!categoryToChange) return;
    const categoryId = categoryToChange.id;
    const res = await fetch(`/api/categories/${categoryId}`, {
      method: HttpMethod.DELETE,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (res.ok) {
      await fetchCategories();
      toggleShowModal(false);
      resetStates();
    } else {
      console.error(res);
    }
  };
  const onCancel = () => {
    toggleShowModal(false);
    // reset to default
    resetStates();
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
                  <a
                    className={`flex h-14 group items-center justify-center px-3 space-x-2 rounded hover:bg-white ${
                      !expand && 'w-12 h-12'
                    }`}
                  >
                    <Circle
                      size={expand ? 'small' : 'big'}
                      color={category.color}
                    ></Circle>
                    {expand && (
                      <span className="flex-1 text-lg text-gray-900">
                        {category.name}
                      </span>
                    )}
                    {expand && (
                      <Menu
                        as="div"
                        onClick={(
                          e: React.MouseEvent<HTMLElement, MouseEvent>
                        ) => e.preventDefault()}
                        className="relative inline-block"
                      >
                        <Menu.Button className="items-center justify-center hidden w-8 h-8 text-gray-900 rounded group-hover:flex hover:bg-gray-50">
                          <EllipsisHorizontalIcon className="w-6 h-6"></EllipsisHorizontalIcon>
                        </Menu.Button>
                        <Transition
                          as={Fragment}
                          enter="transition ease-out duration-100"
                          enterFrom="transform opacity-0 scale-95"
                          enterTo="transform opacity-100 scale-100"
                          leave="transition ease-in duration-75"
                          leaveFrom="transform opacity-100 scale-100"
                          leaveTo="transform opacity-0 scale-95"
                        >
                          <Menu.Items className="absolute right-0 py-1 mt-2 -mr-2 origin-top-right bg-white rounded shadow w-36 focus:outline-none">
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={() => {
                                    toggleShowModal(true);
                                    changeModalAction(
                                      MODAL_ACTION.EDIT_CATEGORY
                                    );
                                    setTargetCategory(category);
                                  }}
                                  className={`text-sm px-3 py-2 cursor-default text-gray-900 ${
                                    active && 'bg-gray-100'
                                  }`}
                                >
                                  Edit category
                                </div>
                              )}
                            </Menu.Item>
                            <Menu.Item>
                              {({ active }) => (
                                <div
                                  onClick={() => {
                                    toggleShowModal(true);
                                    changeModalAction(
                                      MODAL_ACTION.DELETE_CATEGORY
                                    );
                                    setTargetCategory(category);
                                  }}
                                  className={`text-sm px-3 py-2 cursor-default text-red-600 ${
                                    active && 'bg-gray-100'
                                  }`}
                                >
                                  Delete category
                                </div>
                              )}
                            </Menu.Item>
                          </Menu.Items>
                        </Transition>
                      </Menu>
                    )}
                  </a>
                </Link>
              ))}
              <button
                onClick={() => {
                  toggleShowModal(true);
                  changeModalAction(MODAL_ACTION.ADD_CATEGORY);
                }}
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
      {showModal && (
        <Dialog
          open={showModal}
          onClose={() => toggleShowModal(false)}
          className="relative z-50"
        >
          <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
          <div className="fixed inset-0 flex items-center justify-center">
            {modalAction === MODAL_ACTION.ADD_CATEGORY && (
              <Dialog.Panel className="max-w-xl px-12 pt-12 pb-6 mx-auto space-y-12 text-gray-900 bg-white rounded-md">
                <Dialog.Title className="text-2xl font-bold">
                  Add New Category
                </Dialog.Title>

                <div className="flex flex-col w-full space-y-6">
                  <div className="flex flex-col justify-start space-y-2">
                    <label
                      htmlFor="category-name"
                      className="text-sm font-bold"
                    >
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
                  <button
                    onClick={onCancel}
                    className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700"
                  >
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
            )}
            {modalAction === MODAL_ACTION.EDIT_CATEGORY && (
              <Dialog.Panel className="max-w-xl px-12 pt-12 pb-6 mx-auto space-y-12 text-gray-900 bg-white rounded-md">
                <Dialog.Title className="text-2xl font-bold">
                  Edit Category
                </Dialog.Title>

                <div className="flex flex-col w-full space-y-6">
                  <div className="flex flex-col justify-start space-y-2">
                    <label
                      htmlFor="category-name"
                      className="text-sm font-bold"
                    >
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
                  <button
                    onClick={onCancel}
                    className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={editCategory}
                    className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-gray-900 rounded hover:bg-gray-700"
                  >
                    Apply
                  </button>
                </div>
              </Dialog.Panel>
            )}
            {modalAction === MODAL_ACTION.DELETE_CATEGORY && (
              <Dialog.Panel className="max-w-xl px-12 pt-12 pb-6 mx-auto space-y-12 text-gray-900 bg-white rounded-md">
                <Dialog.Title className="text-2xl font-bold text-red-600">
                  Delete Category
                </Dialog.Title>

                <div className="flex flex-col items-center w-full space-y-6">
                  <div className="flex items-center space-x-4">
                    <Circle
                      size={'big'}
                      color={categoryToChange?.color}
                    ></Circle>
                    <span className="text-2xl font-bold text-gray-900">
                      {categoryToChange?.name}
                    </span>
                  </div>
                  <span className="text-gray-900">
                    Are you sure you want to delete this category?
                    <br />
                    Associated tasks will be also deleted.
                  </span>
                </div>
                <div className="flex justify-center space-x-12">
                  <button
                    onClick={onCancel}
                    className="w-24 px-4 py-3 text-lg font-semibold text-center text-gray-900 rounded hover:text-gray-700"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={deleteCategory}
                    className="w-24 px-4 py-3 text-lg font-semibold text-center text-white bg-red-600 rounded hover:bg-red-400"
                  >
                    Delete
                  </button>
                </div>
              </Dialog.Panel>
            )}
          </div>
        </Dialog>
      )}
    </>
  );
}
