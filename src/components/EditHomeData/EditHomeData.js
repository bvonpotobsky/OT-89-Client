import React, { useEffect, useState } from "react";
import { Formik, Field, Form } from "formik";
import apiService from "../../services/server";

export const EditHomeData = () => {
  const [description, setDescription] = useState({
    title: "Hola soy un texto de prueba",
    slider: [
      {
        text: "slider 1",
        file: null,
        imgUrl: "",
      },
      {
        text: "Slider 2",
        file: null,
        imgUrl: "",
      },
      {
        text: "Slider 3",
        file: null,
        imgUrl: "",
      },
    ],
  });

  // Peticion de datos actuales

  useEffect(() => {
    const getData = async () => {
      try {
        const res = await apiService.get("/info-home"); /////////////////////////////////////////////////////////// Revisar endpoint
      } catch (error) {
        console.log(error);
      }
    };

    getData();
  }, []);

  // Handler change para capturar datos del usuario admin

  const fileValidator = (e, index) => {
    const file = e.target.files[0];
    console.log(file);
    const imgUrl = e.target.value;
    // let fileTo = new FormData();
    // fileTo.append("files", file, imgUrl);
    // console.log("El tamanho de este archivo es de: " + file.size);
    if (file.size <= 26214400) {
      setDescription({
        ...description,
        slider: [
          ...description.slider.map((obj, i) => {
            if (i === index) {
              return {
                ...obj,
                file,
                imgUrl,
              };
            } else {
              return obj;
            }
          }),
        ],
      });
    } else {
      console.log(
        "El tamanho de este archivo es mayor al permitido: " +
          file.size +
          "bytes"
      );
    }
  };

  const handleChange = (e, index) => {
    {
      e.target.name === "title"
        ? setDescription({
            ...description,
            [e.target.name]: e.target.value,
          })
        : fileValidator(e, index);
      // setDescription({
      //   ...description,
      //   slider: [
      //     ...description.slider.map((obj, i) => {
      //       if (i === index) {
      //         return {
      //           ...obj,
      //           [e.target.name]: e.target.value,
      //         };
      //       } else {
      //         return obj;
      //       }
      //     }),
      // ],
      // });
    }
    console.log(e.target.files[0]);
    console.log(description);
  };

  // Funcion onSubmit

  const handleSubmit = async () => {
    description.slider.forEach(async ({ file, text }) => {
      let data = new FormData();
      await data.set("file", file);
      const res = await apiService.post("/aws/upload", data, {
        headers: {
          //     accept: "application/json",
          //     // 'Accept-Language': 'en-US,en;q=0.8',
          "Content-Type": `multipart/form-data;`,
        },
      });
      console.log(res);
    });
  };
  return (
    <div>
      <Formik
        initialValues={description}
        // HandleChange
        onSubmit={() => handleSubmit()}
        // validate={() => {

        // }}
      >
        <Form>
          {console.log(description)}
          <Field
            component="textarea"
            name="title"
            value={description.title}
            onChange={(e) => handleChange(e)}
          />
          <div className="slider-main">
            {description.slider.map((slide, index) => (
              <div className="slider-item" key={index}>
                <label>{`Slider ${index + 1}`}</label>
                <Field
                  name="text"
                  value={slide.text}
                  onChange={(e) => handleChange(e, index)}
                />
                <label>Seleciona imagen</label>
                <Field
                  type="file"
                  name="imgUrl"
                  value={slide.imgUrl}
                  onChange={(e) => handleChange(e, index)}
                />
                {/* <input type="file" /> */}
              </div>
            ))}
          </div>
          <div>
            <button type="submit">Submit</button>
          </div>
        </Form>
      </Formik>
    </div>
  );
};
