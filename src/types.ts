type User = {
  id: string;
  email: string;
  name: string;
  email_verified_at: Date | null;
  created_at: Date;
  updated_at: Date;
};

type Note = {
  id: string;
  title: string;
  content: string;
  user_id: string;
  created_at: Date;
  updated_at: Date;
};

export type { User, Note };