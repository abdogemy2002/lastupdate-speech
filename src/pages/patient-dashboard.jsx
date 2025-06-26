import React from 'react';
import { Container, Row, Col, Card, ProgressBar, Badge, Carousel } from 'react-bootstrap';
import { FaTrophy, FaChartLine, FaBook, FaUser, FaMicrophone, FaStar } from 'react-icons/fa';

const DashboardPage = () => {
  // بيانات المستخدم الافتراضية
  const userData = {
    name: "أحمد محمد",
    level: "متوسط",
    points: 750,
    nextLevelPoints: 250,
    progress: 65,
    completedLessons: 18,
    streak: 5
  };

  // المراحل التعليمية
  const stages = [
    { id: 1, title: "الكلمات", description: "تحسين نطق الكلمات الفردية", icon: "📝", completed: true },
    { id: 2, title: "جمل بسيطة", description: "نطق جمل قصيرة وبسيطة", icon: "🗣️", completed: true, current: true },
    { id: 3, title: "جمل صعبة", description: "نطق جمل طويلة ومعقدة", icon: "💬", completed: false }
  ];

  // الأطباء المقترحين
  const doctors = [
    { 
      id: 1, 
      name: "د. محمد علي", 
      specialty: "أخصائي نطق ولغة", 
      rating: 4.8, 
      image: "/img/doctor1.jpg",
      availableSlots: ["الإثنين 10 ص", "الأربعاء 2 م", "السبت 11 ص"]
    },
    { 
      id: 2, 
      name: "د. سارة أحمد", 
      specialty: "اخصائية تخاطب", 
      rating: 4.9, 
      image: "/img/doctor2.jpg",
      availableSlots: ["الأحد 9 ص", "الثلاثاء 3 م", "الخميس 1 م"]
    },
    { 
      id: 3, 
      name: "د. خالد عبد الرحمن", 
      specialty: "استشاري نطق", 
      rating: 4.7, 
      image: "/img/doctor3.jpg",
      availableSlots: ["الإثنين 4 م", "الأربعاء 11 ص", "الجمعة 10 ص"]
    }
  ];

  return (
    <Container className="py-4">
      {/* رأس الصفحة */}
      <Row className="mb-4 align-items-center">
        <Col md={6}>
          <h2 className="mb-0">مرحباً، {userData.name}</h2>
          <p className="text-muted mb-0">استمر في التعلم لتحسين نطقك</p>
        </Col>
        <Col md={6} className="d-flex justify-content-end">
          <Badge pill bg="light" text="dark" className="d-flex align-items-center me-3">
            <FaUser className="me-2" /> {userData.level}
          </Badge>
          <Badge pill bg="warning" text="dark" className="d-flex align-items-center">
            <FaTrophy className="me-2" /> {userData.points} نقطة
          </Badge>
        </Col>
      </Row>

      {/* إحصائيات سريعة */}
      <Row className="mb-4">
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-primary bg-opacity-10 p-3 rounded me-3">
                  <FaChartLine className="text-primary" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">تقدمك</h6>
                  <h4 className="mb-0">{userData.progress}%</h4>
                </div>
              </div>
              <ProgressBar now={userData.progress} className="mt-3" variant="primary" />
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-3 mb-md-0">
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-success bg-opacity-10 p-3 rounded me-3">
                  <FaBook className="text-success" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">الدروس المكتملة</h6>
                  <h4 className="mb-0">{userData.completedLessons}</h4>
                </div>
              </div>
              <p className="text-muted mb-0 mt-3">+3 دروس هذا الأسبوع</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100">
            <Card.Body>
              <div className="d-flex align-items-center">
                <div className="bg-danger bg-opacity-10 p-3 rounded me-3">
                  <FaMicrophone className="text-danger" size={24} />
                </div>
                <div>
                  <h6 className="mb-0">أيام متتالية</h6>
                  <h4 className="mb-0">{userData.streak}</h4>
                </div>
              </div>
              <p className="text-muted mb-0 mt-3">لا تنقطع عن التعلم!</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* المراحل التعليمية */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">المراحل التعليمية</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {stages.map(stage => (
                  <Col md={4} key={stage.id} className="mb-3 mb-md-0">
                    <Card className={`h-100 ${stage.current ? 'border-primary border-2' : ''}`}>
                      <Card.Body className="text-center">
                        <div className={`mb-3 p-3 rounded ${stage.completed ? 'bg-success bg-opacity-10' : 'bg-light'}`}>
                          <span style={{ fontSize: '2rem' }}>{stage.icon}</span>
                        </div>
                        <h4>{stage.title}</h4>
                        <p className="text-muted">{stage.description}</p>
                        {stage.completed && (
                          <Badge bg="success" className="mt-2">مكتمل</Badge>
                        )}
                        {stage.current && (
                          <Badge bg="primary" className="mt-2">جاري العمل</Badge>
                        )}
                        {!stage.completed && !stage.current && (
                          <Badge bg="secondary" className="mt-2">قفل</Badge>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* الأطباء المقترحين */}
      <Row className="mb-4">
        <Col>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">الأطباء المقترحين</h5>
            </Card.Header>
            <Card.Body>
              <Carousel interval={null} indicators={false}>
                {doctors.map(doctor => (
                  <Carousel.Item key={doctor.id}>
                    <div className="d-flex justify-content-center">
                      <Card style={{ width: '100%', maxWidth: '600px' }}>
                        <Row className="g-0">
                          <Col md={4} className="d-flex align-items-center justify-content-center p-3">
                            <img 
                              src={doctor.image} 
                              alt={doctor.name}
                              className="img-fluid rounded-circle"
                              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                            />
                          </Col>
                          <Col md={8}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h4 className="mb-1">{doctor.name}</h4>
                                  <p className="text-muted mb-2">{doctor.specialty}</p>
                                </div>
                                <Badge bg="warning" className="d-flex align-items-center">
                                  <FaStar className="me-1" /> {doctor.rating}
                                </Badge>
                              </div>
                              
                              <h6 className="mt-3">المواعيد المتاحة:</h6>
                              <div className="d-flex flex-wrap gap-2 mt-2">
                                {doctor.availableSlots.map((slot, index) => (
                                  <Badge key={index} bg="light" text="dark" pill>
                                    {slot}
                                  </Badge>
                                ))}
                              </div>
                              
                              <div className="d-flex gap-2 mt-4">
                                <button className="btn btn-outline-primary flex-grow-1">
                                  حجز موعد
                                </button>
                                <button className="btn btn-primary flex-grow-1">
                                  عرض الملف الشخصي
                                </button>
                              </div>
                            </Card.Body>
                          </Col>
                        </Row>
                      </Card>
                    </div>
                  </Carousel.Item>
                ))}
              </Carousel>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* الدروس المقترحة */}
      <Row>
        <Col>
          <Card>
            <Card.Header className="bg-light">
              <h5 className="mb-0">دروس مقترحة لك</h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="mb-3">
                  <Card className="h-100">
                    <Card.Img variant="top" src="/img/pronunciation1.jpg" height="160" style={{ objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>الحروف المفخمة</Card.Title>
                      <Card.Text>
                        تعلم نطق الحروف المفخمة بشكل صحيح مع تمارين تفاعلية.
                      </Card.Text>
                      <button className="btn btn-primary w-100">ابدأ الدرس</button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="h-100">
                    <Card.Img variant="top" src="/img/pronunciation2.jpg" height="160" style={{ objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>التنغيم في الجمل</Card.Title>
                      <Card.Text>
                        تحسين تنغيم صوتك عند نطق الجمل الطويلة.
                      </Card.Text>
                      <button className="btn btn-primary w-100">ابدأ الدرس</button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4} className="mb-3">
                  <Card className="h-100">
                    <Card.Img variant="top" src="/img/pronunciation3.jpg" height="160" style={{ objectFit: 'cover' }} />
                    <Card.Body>
                      <Card.Title>الكلمات المتشابهة</Card.Title>
                      <Card.Text>
                        تمييز ونطق الكلمات المتشابهة في اللغة العربية.
                      </Card.Text>
                      <button className="btn btn-primary w-100">ابدأ الدرس</button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default DashboardPage;