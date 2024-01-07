"use client";
import * as yup from "yup";
import { useFormik } from "formik";

import React from "react";
import { Modal, Button, Input } from "@nextui-org/react";
import { ModalHeader, ModalBody, ModalFooter } from "@nextui-org/modal";

export default function CreatEditUserDialog({
  dialogFlag,
  toggleDialog,
  user,
}: any) {
  const validationSchema = yup.object({
    userName: yup.string().required("Please enter username"),
    password: yup.string().required("Please enter password"),
  });

  const closeHandler = () => {
    toggleDialog(false);
  };

  const formik = useFormik({
    validationSchema,
    initialValues: {
      userName: user?.userName || "",
      password: "",
    },
    onSubmit: async () => {
      if (!user?.userId) {
        try {
          // event?.preventDefault();
          const data = {
            userName: formik.values.userName,
            password: formik.values.password,
          };

          let response = await fetch("/api/user", {
            method: "POST",
            body: JSON.stringify(formik.values),
          });

          toggleDialog(false);
        } catch (err) {
          alert("Error in creating user. please try again");
        }
      } else {
        try {
          // event?.preventDefault();
          const data = {
            userName: formik.values.userName,
            password: formik.values.password,
          };

          let response = await fetch("/api/user", {
            method: "PUT",
            body: JSON.stringify(formik.values),
          });

          toggleDialog(false);
        } catch (err) {
          alert("Error in creating user. please try again");
        }
      }
    },
  });

  return (
    <Modal
      closeButton
      aria-labelledby="modal-title"
      isOpen={dialogFlag}
      onClose={() => toggleDialog(false)}
      size="xs"
    >
      <ModalHeader>Create User</ModalHeader>
      <form onSubmit={formik.handleSubmit}>
        <ModalBody>
          <Input
            type="userName"
            name="userName"
            id="userName"
            value={formik.values.userName}
            onChange={formik.handleChange}
            isClearable
            fullWidth
            color="primary"
            size="lg"
            placeholder="User Name"
            // contentLeft={<Mail fill="currentColor" />}
          />
          <Input
            type="password"
            name="password"
            id="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            isClearable
            fullWidth
            color="primary"
            size="lg"
            placeholder="Password"
          />
          {/* <Row justify="space-between">
            <Checkbox>
            <Text size={14}>Remember me</Text>
            </Checkbox>
            <Text size={14}>Forgot password?</Text>
          </Row> */}
        </ModalBody>
        <ModalFooter>
          <Button onClick={closeHandler}>Close</Button>
          <Button type="submit">{!user ? 'Create User' : 'Update User'}</Button>
        </ModalFooter>
      </form>
    </Modal>
  );
}
