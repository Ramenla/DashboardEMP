import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, DatePicker, Row, Col, Divider, Button, Collapse, Upload } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const ProjectModal = ({ open, onCancel, onSave, project, loading }) => {
    const [form] = Form.useForm();

    // Auto-calculate Duration & StartMonth when dates change
    const handleDateChange = (_, values) => {
        const { startDate, endDate } = values;
        if (startDate && endDate) {
            const start = dayjs(startDate);
            const end = dayjs(endDate);
            
            // Calculate duration in months (approximate)
            const duration = end.diff(start, 'month') + 1;
            
            // Get start month index (0-11)
            const startMonth = start.month();
            
            form.setFieldsValue({ 
                duration: duration > 0 ? duration : 1,
                startMonth: startMonth
            });
        }
    };

    useEffect(() => {
        if (open) {
            if (project) {
                form.setFieldsValue({
                    ...project,
                    startDate: project.startDate ? dayjs(project.startDate, 'DD MMM YYYY') : null,
                    endDate: project.endDate ? dayjs(project.endDate, 'DD MMM YYYY') : null,
                });
            } else {
                form.resetFields();
            }
        }
    }, [project, form, open]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const formatted = {
                ...values,
                startDate: values.startDate ? values.startDate.format('DD MMM YYYY') : null,
                endDate: values.endDate ? values.endDate.format('DD MMM YYYY') : null,
            };
            onSave(formatted);
        });
    };

    // helper: render dynamic list field (issues = simple string list)
    const renderIssuesList = () => (
        <Form.List name="issues">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...rest }) => (
                        <div key={key} className="flex items-center gap-2 mb-1.5">
                            <Form.Item {...rest} name={name} className="!mb-0 flex-1">
                                <Input placeholder="Deskripsi isu..." size="small" />
                            </Form.Item>
                            <MinusCircleOutlined className="text-red-400 cursor-pointer text-xs" onClick={() => remove(name)} />
                        </div>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" block>
                        Tambah Isu
                    </Button>
                </>
            )}
        </Form.List>
    );

    // helper: render timeline events list
    const renderTimelineList = () => (
        <Form.List name="timelineEvents">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...rest }) => (
                        <Row key={key} gutter={6} className="mb-1.5" align="middle">
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'date']} className="!mb-0">
                                    <Input placeholder="Tanggal" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item {...rest} name={[name, 'title']} className="!mb-0">
                                    <Input placeholder="Judul" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'status']} className="!mb-0">
                                    <Select placeholder="Status" size="small" options={[
                                        { label: 'Selesai', value: 'finish' },
                                        { label: 'Proses', value: 'process' },
                                        { label: 'Error', value: 'error' },
                                        { label: 'Menunggu', value: 'wait' },
                                    ]} />
                                </Form.Item>
                            </Col>
                            <Col span={6}>
                                <Form.Item {...rest} name={[name, 'description']} className="!mb-0">
                                    <Input placeholder="Keterangan" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={1} className="text-center">
                                <MinusCircleOutlined className="text-red-400 cursor-pointer text-xs" onClick={() => remove(name)} />
                            </Col>
                        </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" block>
                        Tambah Milestone
                    </Button>
                </>
            )}
        </Form.List>
    );

    // helper: render team list
    const renderTeamList = () => (
        <Form.List name="team">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...rest }) => (
                        <Row key={key} gutter={6} className="mb-1.5" align="middle">
                            <Col span={11}>
                                <Form.Item {...rest} name={[name, 'name']} className="!mb-0">
                                    <Input placeholder="Nama anggota" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={11}>
                                <Form.Item {...rest} name={[name, 'role']} className="!mb-0">
                                    <Input placeholder="Jabatan / Role" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={2} className="text-center">
                                <MinusCircleOutlined className="text-red-400 cursor-pointer text-xs" onClick={() => remove(name)} />
                            </Col>
                        </Row>
                    ))}
                    <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />} size="small" block>
                        Tambah Anggota
                    </Button>
                </>
            )}
        </Form.List>
    );

    // helper: render documents list with Upload
    const renderDocumentsList = () => (
        <Form.List name="documents">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...rest }) => (
                        <Row key={key} gutter={6} className="mb-1.5" align="middle">
                            <Col span={8}>
                                <Form.Item {...rest} name={[name, 'name']} className="!mb-0">
                                    <Input placeholder="Nama file" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'type']} className="!mb-0">
                                    <Select placeholder="Tipe" size="small" options={[
                                        { label: 'PDF', value: 'PDF' },
                                        { label: 'Excel', value: 'Excel' },
                                        { label: 'Word', value: 'Word' },
                                        { label: 'Image', value: 'Image' },
                                    ]} />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'date']} className="!mb-0">
                                    <Input placeholder="Tanggal" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'size']} className="!mb-0">
                                    <Input placeholder="Ukuran" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={1} className="text-center">
                                <MinusCircleOutlined className="text-red-400 cursor-pointer text-xs" onClick={() => remove(name)} />
                            </Col>
                        </Row>
                    ))}
                         
                    <div style={{ marginTop: 8 }}>
                         <Upload
                            beforeUpload={(file) => {
                                const newDoc = {
                                    name: file.name,
                                    type: file.name.split('.').pop().toUpperCase(),
                                    date: dayjs().format('DD MMM YYYY'),
                                    size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
                                };
                                const currentDocs = form.getFieldValue('documents') || [];
                                form.setFieldsValue({ documents: [...currentDocs, newDoc] });
                                return false; // Prevent auto upload
                            }}
                            showUploadList={false}
                        >
                            <Button type="dashed" icon={<UploadOutlined />} size="small" block>
                                Upload Dokumen
                            </Button>
                        </Upload>
                    </div>
                </>
            )}
        </Form.List>
    );

    // helper: render gallery list with Upload
    const renderGalleryList = () => (
        <Form.List name="gallery">
            {(fields, { add, remove }) => (
                <>
                    {fields.map(({ key, name, ...rest }) => (
                        <Row key={key} gutter={6} className="mb-1.5" align="middle">
                            <Col span={10}>
                                <Form.Item {...rest} name={[name, 'url']} className="!mb-0">
                                    <Input placeholder="URL gambar" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={7}>
                                <Form.Item {...rest} name={[name, 'caption']} className="!mb-0">
                                    <Input placeholder="Caption" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={5}>
                                <Form.Item {...rest} name={[name, 'date']} className="!mb-0">
                                    <Input placeholder="Tanggal" size="small" />
                                </Form.Item>
                            </Col>
                            <Col span={2} className="text-center">
                                <MinusCircleOutlined className="text-red-400 cursor-pointer text-xs" onClick={() => remove(name)} />
                            </Col>
                        </Row>
                    ))}

                    <div style={{ marginTop: 8 }}>
                        <Upload
                            listType="picture"
                            beforeUpload={(file) => {
                                const imageUrl = URL.createObjectURL(file);
                                const newPhoto = {
                                    url: imageUrl,
                                    caption: file.name,
                                    date: dayjs().format('DD MMM YYYY'),
                                };
                                const currentGallery = form.getFieldValue('gallery') || [];
                                form.setFieldsValue({ gallery: [...currentGallery, newPhoto] });
                                return false; // Prevent auto upload
                            }}
                            showUploadList={false}
                        >
                            <Button type="dashed" icon={<UploadOutlined />} size="small" block>
                                Upload Foto
                            </Button>
                        </Upload>
                    </div>
                </>
            )}
        </Form.List>
    );

    // collapse items untuk data tambahan
    const collapseItems = [
        { key: 'issues', label: 'Kendala & Isu', children: renderIssuesList() },
        { key: 'timeline', label: 'Timeline / Milestone', children: renderTimelineList() },
        { key: 'team', label: 'Tim Proyek', children: renderTeamList() },
        {
            key: 'hse',
            label: 'Statistik HSE (K3)',
            children: (
                <Row gutter={12}>
                    <Col span={6}>
                        <Form.Item name={['hse', 'manHours']} label="Man Hours" className="!mb-0">
                            <InputNumber min={0} className="w-full" size="small" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'safeHours']} label="Safe Hours" className="!mb-0">
                            <InputNumber min={0} className="w-full" size="small" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'incidents']} label="Incidents" className="!mb-0">
                            <InputNumber min={0} className="w-full" size="small" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name={['hse', 'fatality']} label="Fatality" className="!mb-0">
                            <InputNumber min={0} className="w-full" size="small" />
                        </Form.Item>
                    </Col>
                </Row>
            ),
        },
        { key: 'docs', label: 'Dokumen Proyek', children: renderDocumentsList() },
        { key: 'gallery', label: 'Galeri Foto', children: renderGalleryList() },
    ];

    return (
        <Modal
            title={project ? 'Edit Proyek' : 'Tambah Proyek Baru'}
            open={open}
            onCancel={onCancel}
            onOk={handleSubmit}
            confirmLoading={loading}
            width={780}
            okText="Simpan"
            cancelText="Batal"
            destroyOnClose
            centered
            styles={{
                body: {
                    maxHeight: '65vh',
                    overflowY: 'auto',
                    paddingRight: 6,
                    paddingTop: 4,
                },
            }}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark={false}
                initialValues={{
                    progress: 0,
                    target: 0,
                    budgetUsed: 0,
                    budgetTotal: 0,
                    startMonth: 0,
                    duration: 1,
                    category: 'EXPLORATION',
                    status: 'ON_TRACK',
                    priority: 'MEDIUM',
                    issues: [],
                    timelineEvents: [],
                    team: [],
                    hse: { manHours: 0, safeHours: 0, incidents: 0, fatality: 0 },
                    documents: [],
                    gallery: [],
                }}
                onValuesChange={handleDateChange}
                size="small"
                className="project-modal-form"
            >
                {/* ===== INFORMASI DASAR ===== */}
                <Divider orientation="left" className="!text-[11px] !text-gray-400 !font-semibold !mt-0 !mb-2">INFORMASI DASAR</Divider>

                <Row gutter={10}>
                    <Col span={5}>
                        <Form.Item name="id" label="Kode" rules={[{ required: true, message: 'Wajib' }]}>
                            <Input disabled={!!project} placeholder="EXP-101" />
                        </Form.Item>
                    </Col>
                    <Col span={19}>
                        <Form.Item name="name" label="Nama Proyek" rules={[{ required: true, message: 'Wajib' }]}>
                            <Input placeholder="Nama lengkap proyek" />
                        </Form.Item>
                    </Col>
                </Row>

                <Row gutter={10}>
                    <Col span={6}>
                        <Form.Item name="category" label="Kategori" rules={[{ required: true, message: 'Wajib' }]}>
                            <Select placeholder="Pilih" options={[
                                { label: 'Exploration', value: 'EXPLORATION' },
                                { label: 'Drilling', value: 'DRILLING' },
                                { label: 'Operation', value: 'OPERATION' },
                                { label: 'Facility', value: 'FACILITY' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="status" label="Status">
                            <Select options={[
                                { label: 'On Track', value: 'ON_TRACK' },
                                { label: 'Delayed', value: 'DELAYED' },
                                { label: 'At Risk', value: 'AT_RISK' },
                                { label: 'Completed', value: 'COMPLETED' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="priority" label="Prioritas">
                            <Select options={[
                                { label: 'Low', value: 'LOW' },
                                { label: 'Medium', value: 'MEDIUM' },
                                { label: 'High', value: 'HIGH' },
                            ]} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="location" label="Lokasi">
                            <Select placeholder="Pilih" options={[
                                { label: "Sumatra - 'B' Block", value: "'B' Block (Sumatra)" },
                                { label: "Sumatra - Bireun-Sigli Block", value: "Bireun-Sigli Block (Sumatra)" },
                                { label: "Sumatra - Gebang Block", value: "Gebang Block (Sumatra)" },
                                { label: "Sumatra - Tonga Block", value: "Tonga Block (Sumatra)" },
                                { label: "Sumatra - Malacca Strait Block", value: "Malacca Strait Block (Sumatra)" },
                                { label: "Sumatra - Siak Block", value: "Siak Block (Sumatra)" },
                                { label: "Sumatra - Kampar Block", value: "Kampar Block (Sumatra)" },
                                { label: "Sumatra - Bentu Block", value: "Bentu Block (Sumatra)" },
                                { label: "Sumatra - Korinci Baru Block", value: "Korinci Baru Block (Sumatra)" },
                                { label: "Sumatra - South CPP Block", value: "South CPP Block (Sumatra)" },
                                { label: "Jawa - Kangean Block", value: "Kangean Block (Jawa)" },
                                { label: "Sulawesi - Sengkang Block", value: "Sengkang Block (Sulawesi)" },
                                { label: "Mozambique - Buzi EPCC", value: "Buzi EPCC (Mozambique)" },
                            ]} />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== PENANGGUNG JAWAB ===== */}
                <Divider orientation="left" className="!text-[11px] !text-gray-400 !font-semibold !mt-0 !mb-2">PENANGGUNG JAWAB</Divider>

                <Row gutter={10}>
                    <Col span={12}>
                        <Form.Item name="sponsor" label="Sponsor">
                            <Input placeholder="Contoh: SKK Migas" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="manager" label="Manajer Proyek">
                            <Input placeholder="Nama manager" />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== TIMELINE ===== */}
                <Divider orientation="left" className="!text-[11px] !text-gray-400 !font-semibold !mt-0 !mb-2">TIMELINE</Divider>

                <Row gutter={10}>
                    <Col span={6}>
                        <Form.Item name="startDate" label="Tgl Mulai">
                            <DatePicker className="w-full" format="DD MMM YYYY" placeholder="Pilih" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="endDate" label="Tgl Selesai">
                            <DatePicker className="w-full" format="DD MMM YYYY" placeholder="Pilih" />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="startMonth" label="Bulan Mulai">
                            <Select disabled options={[
                                'Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des'
                            ].map((m, i) => ({ label: m, value: i }))} />
                        </Form.Item>
                    </Col>
                    <Col span={6}>
                        <Form.Item name="duration" label="Durasi (bln)">
                            <InputNumber min={1} max={60} className="w-full" disabled />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== PROGRESS & BUDGET ===== */}
                <Divider orientation="left" className="!text-[11px] !text-gray-400 !font-semibold !mt-0 !mb-2">PROGRESS & BUDGET</Divider>

                <Row gutter={10}>
                    <Col span={4}>
                        <Form.Item name="progress" label="Progress">
                            <InputNumber min={0} max={100} className="w-full" addonAfter="%" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="target" label="Target">
                            <InputNumber min={0} max={100} className="w-full" addonAfter="%" />
                        </Form.Item>
                    </Col>
                    <Col span={4}>
                        <Form.Item name="budgetUsed" label="Bgt Used">
                            <InputNumber min={0} max={100} className="w-full" addonAfter="%" />
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item name="budgetTotal" label="Total Budget (IDR)">
                            <InputNumber
                                className="w-full"
                                formatter={value => `Rp ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                                parser={value => value.replace(/Rp\s?|(,*)/g, '')}
                            />
                        </Form.Item>
                    </Col>
                </Row>

                {/* ===== DATA TAMBAHAN (collapsible) ===== */}
                <Divider orientation="left" className="!text-[11px] !text-gray-400 !font-semibold !mt-0 !mb-2">DATA TAMBAHAN</Divider>

                <Collapse
                    size="small"
                    ghost
                    items={collapseItems}
                    className="project-modal-collapse"
                />
            </Form>
        </Modal>
    );
};

export default ProjectModal;
