import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { checkAuth } from '../store/slices/authSlice';

export default function AuthInit({ children }) {
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);
  return children;
}
