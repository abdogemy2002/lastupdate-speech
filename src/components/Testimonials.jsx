import React from 'react';
import '../style/Testimonials.css';
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

const Testimonials = () => {
  return (
    <section className="testimonials-section py-5">
      <div className="container">
        <h2 className="text-center testimonial-heading mb-5">ماذا يقول أعضاؤنا</h2>
        <div
          id="testimonialCarousel"
          className="carousel slide"
          data-bs-ride="carousel"
        >
          <div className="carousel-indicators">
            <button
              type="button"
              data-bs-target="#testimonialCarousel"
              data-bs-slide-to="0"
              className="active"
              aria-current="true"
              aria-label="Slide 1"
            ></button>
            <button
              type="button"
              data-bs-target="#testimonialCarousel"
              data-bs-slide-to="1"
              aria-label="Slide 2"
            ></button>
            <button
              type="button"
              data-bs-target="#testimonialCarousel"
              data-bs-slide-to="2"
              aria-label="Slide 3"
            ></button>
          </div>

          <div className="carousel-inner">
            <div className="carousel-item active">
              <div className="testimonial-card text-center">
                <div
                  className="testimonial-img mx-auto rounded-circle mb-4"
                  style={{ backgroundImage: 'url(src/assets/user-img.jpg)' }}
                />
                <blockquote className="blockquote">
                  <p className="mb-4">
                    "برنامج تصحيح النطق ساعدني في تحسين قدراتي الصوتية بشكل
                    ملحوظ. شكرًا جزيلاً!"
                  </p>
                </blockquote>
                <footer>- أحمد جاد -</footer>
              </div>
            </div>

            <div className="carousel-item">
              <div className="testimonial-card text-center">
                <div
                  className="testimonial-img mx-auto rounded-circle mb-4"
                  style={{ backgroundImage: 'url(src/assets/user-img.jpg)' }}
                />
                <blockquote className="blockquote">
                  <p className="mb-4">
                    "التقدم الذي حققته بفضل هذا البرنامج كان مذهلاً. نطق ابني
                    تحسن بشكل ملحوظ."
                  </p>
                </blockquote>
                <footer>- سارة فؤاد -</footer>
              </div>
            </div>

            <div className="carousel-item">
              <div className="testimonial-card text-center">
                <div
                  className="testimonial-img mx-auto rounded-circle mb-4"
                  style={{ backgroundImage: 'url(src/assets/user-img.jpg)' }}
                />
                <blockquote className="blockquote">
                  <p className="mb-4">
                    "تجربة رائعة! النظام ساعدني كثيرًا في تحسين نطق ابني
                    وضبطه بشكل كبير."
                  </p>
                </blockquote>
                <footer>- مصطفى علي -</footer>
              </div>
            </div>
          </div>

          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="prev"
          >
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#testimonialCarousel"
            data-bs-slide="next"
          >
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
