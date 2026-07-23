// services/blog-service.ts
import axios from 'axios';

export interface UpdateBlogPayload {
  id: string;
  title: string;
  content: string;
  category?: string;
}

// Global Axios API Service Methods
export const blogService = {
  // PUT: Update Blog
  updateBlog: async (payload: UpdateBlogPayload) => {
    const response = await axios.put(`/api/blogs/${payload.id}`, {
      title: payload.title,
      content: payload.content,
      category: payload.category,
    });
    return response.data;
  },

  // DELETE: Delete Blog
  deleteBlog: async (id: string) => {
    const response = await axios.delete(`/api/blogs/${id}`);
    return response.data;
  },
};