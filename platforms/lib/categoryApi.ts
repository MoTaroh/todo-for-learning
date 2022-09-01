import { HttpMethod } from '@/types';
import { CategoryData } from '@/types/category';

export const fetchCategories = async () => {
  const res = await fetch('/api/categories');
  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return [{}];
  }
};

export const createCategory = async (category: CategoryData) => {
  const res = await fetch('/api/categories', {
    method: HttpMethod.POST,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });

  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return {};
  }
};

export const updateCategory = async (category: CategoryData) => {
  const res = await fetch(`/api/categories/${category.id}`, {
    method: HttpMethod.PUT,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(category),
  });
  if (res.ok) {
    return await res.json();
  } else {
    console.error(res);
    return {};
  }
};

export const deleteCategory = async (id: string) => {
  const res = await fetch(`/api/categories/${id}`, {
    method: HttpMethod.DELETE,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (!res.ok) {
    console.error(res);
  }
  return res.status;
};
