import { Role, form_t, user_t } from "../data";

type CanViewFormParams = {
  user: user_t;
  form: form_t;
};

export function canViewForm({ user, form }: CanViewFormParams) {
  return user.role === Role.TEACHER || form.userId == user.uid;
}

type ScopedFormsParams = {
  user: user_t;
  forms: form_t[];
};

export function scopedForms({ user, forms }: ScopedFormsParams) {
  if (user.role == Role.TEACHER) return forms;
  return forms.filter((form) => form.userId === user.uid);
}
