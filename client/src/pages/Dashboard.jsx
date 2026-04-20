import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import socket from '../services/socket';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch posts when component mounts or page changes
  useEffect(() => {
    fetchPosts(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Connect when component mounts (user is logged in)
    socket.connect();

    // Listen for successful connection
    socket.on('connect', () => {
      console.log('🔌 Socket connected:', socket.id);
    });

    // Listen for disconnection
    socket.on('disconnect', (reason) => {
      console.log('❌ Socket disconnected:', reason);
    });

    // Listen for connection errors
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error.message);
    });

    // Cleanup when component unmounts
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.disconnect();
    };
  }, []);

  const fetchPosts = async (page) => {
    setIsLoading(true);
    setError('');

    try {
      const response = await api.get(`/api/posts?page=${page}&limit=10`);
      // Support multiple response shapes: { posts: [...] }, { data: [...] }, or direct array
      const postsData = response.data?.posts ?? response.data?.data ?? response.data ?? [];
      setPosts(Array.isArray(postsData) ? postsData : []);

      // Normalize pagination and add convenient flags used by the UI
      const rawPagination = response.data?.pagination ?? {};
      const pageNum = rawPagination.page ?? page;
      const totalPages = rawPagination.totalPages ?? Math.ceil((rawPagination.total ?? 0) / (rawPagination.limit ?? 10));

      setPagination({
        ...rawPagination,
        page: pageNum,
        totalPages,
        hasPrevPage: pageNum > 1,
        hasNextPage: pageNum < totalPages
      });
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (postId) => {
    // Show confirmation dialog
    const confirmed = window.confirm(
      'Are you sure you want to delete this post? This action cannot be undone.'
    );

    if (!confirmed) {
      return; // User cancelled
    }

    try {
      const response = await api.delete(`/api/posts/${postId}`);

      if (response.data.success) {
        // Remove post from UI immediately (optimistic update)
        setPosts(posts.filter(post => post._id !== postId));
        
        // Update pagination count
        setPagination(prev => ({
          ...prev,
          total: prev.total - 1
        }));

        // Show success toast
        toast.success('Post deleted successfully');
      }
    } catch (error) {
      console.error('Delete error:', error);
      // Interceptor will show toast; set inline error state if needed
      setError(error.response?.data?.message || 'Failed to delete post');
    }
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  if (isLoading) {
    return <div style={loadingStyle}>Loading posts...</div>;
  }

  return (
    <div style={containerStyle}>
      {/* Header with Create Button */}
      <div style={headerStyle}>
        <h1>Welcome, {user.name}!</h1>
        <Link to="/create">
          <button style={createButtonStyle}>
            + Create New Post
          </button>
        </Link>
      </div>

      {/* Error Message */}
      {error && <div style={errorStyle}>{error}</div>}

      {/* Posts List */}
      <div style={postsContainerStyle}>
        {posts.length === 0 ? (
          <div style={emptyStateStyle}>
            <p>You haven't created any posts yet.</p>
            <Link to="/create">Create your first post</Link>
          </div>
        ) : (
          <>
            {posts.map((post) => (
              <div key={post._id} style={postCardStyle}>
                {post.coverImage && (
                  <img
                    src={post.coverImage}
                    alt={`Cover image for ${post.title}`}
                    style={coverImageStyle}
                  />
                )}
                <h3>{post.title}</h3>
                <p style={contentPreviewStyle}>
                  {post.content.substring(0, 150)}...
                </p>
                <div style={actionsStyle}>
                  <Link to={`/edit/${post._id}`}>
                    <button style={editButtonStyle}>
                      Edit
                    </button>
                  </Link>
                  
                  <button 
                    onClick={() => handleDelete(post._id)}
                    style={deleteButtonStyle}
                  >
                    Delete
                  </button>
                </div>
                <div style={metaStyle}>
                  <span>{post.category}</span>
                  <span>{post.status}</span>
                  <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}

            {/* Pagination Controls */}
            <div style={paginationStyle}>
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!pagination.hasPrevPage}
                style={paginationButtonStyle}
              >
                Previous
              </button>

              <span style={pageInfoStyle}>
                Page {pagination.page} of {pagination.totalPages} 
                ({pagination.total} total posts)
              </span>

              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!pagination.hasNextPage}
                style={paginationButtonStyle}
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const containerStyle = {
  minHeight: '80vh',
  padding: '2rem',
  maxWidth: '1200px',
  margin: '0 auto',
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const logoutButtonStyle = {
  padding: '0.5rem 1.5rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  fontWeight: '500',
};

const createButtonStyle = {
  padding: '0.6rem 1.2rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 600,
  boxShadow: '0 2px 6px rgba(0,123,255,0.12)'
};

const contentStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
  gap: '2rem',
};

const cardStyle = {
  padding: '2rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const infoStyle = {
  marginTop: '1rem',
  lineHeight: '2',
};  

const paginationStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginTop: '2rem',
  padding: '1rem',
  backgroundColor: 'white',
  borderRadius: '8px',
};

const paginationButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const pageInfoStyle = {
  color: '#666',
  fontSize: '0.9rem',
};

const postCardStyle = {
  padding: '1.5rem',
  backgroundColor: 'white',
  borderRadius: '8px',
  marginBottom: '1rem',
  boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
};

const coverImageStyle = {
  width: '100%',
  maxHeight: '220px',
  objectFit: 'cover',
  borderRadius: '6px',
  marginBottom: '0.75rem',
};

const contentPreviewStyle = {
  color: '#666',
  margin: '1rem 0',
};

const metaStyle = {
  display: 'flex',
  gap: '1rem',
  fontSize: '0.85rem',
  color: '#999',
};

const loadingStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  minHeight: '80vh',
  fontSize: '1.2rem',
  color: '#666',
};

const errorStyle = {
  margin: '1rem 0',
  padding: '0.75rem 1rem',
  backgroundColor: '#f8d7da',
  color: '#842029',
  borderRadius: '6px',
  border: '1px solid #f5c2c7',
};

const postsContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
};

const emptyStateStyle = {
  padding: '2rem',
  textAlign: 'center',
  backgroundColor: 'white',
  borderRadius: '8px',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
  color: '#666',
};

const actionsStyle = {
  display: 'flex',
  gap: '1rem',
  marginTop: '1rem',
};

const deleteButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
};

const editButtonStyle = {
  padding: '0.5rem 1rem',
  backgroundColor: '#007bff',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  cursor: 'pointer',
  textDecoration: 'none',
};

export default Dashboard;